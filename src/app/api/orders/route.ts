// L'API des commandes : POST /api/orders
//
// Son rôle se limite à faire le « guichet » : recevoir la demande, vérifier son format,
// confier le travail à la logique métier (server/orders.ts), puis répondre.
//
// Réponses possibles :
// - 201 Created     : la commande est enregistrée → { id, number }
// - 400 Bad Request : formulaire mal rempli → { error, fields }
// - 409 Conflict    : le panier ne correspond plus au catalogue → { error }
// - 500             : problème imprévu (base injoignable…) → { error }
import { z } from "zod";
import { OrderError, createOrder, orderInputSchema } from "@/server/orders";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête illisible." }, { status: 400 });
  }

  const parsed = orderInputSchema.safeParse(body);
  if (!parsed.success) {
    // Pour chaque champ, le premier message d'erreur : { phone: ["Numéro de téléphone invalide"] }
    const fields = z.flattenError(parsed.error).fieldErrors;
    return Response.json({ error: "Certains champs sont à corriger.", fields }, { status: 400 });
  }

  try {
    const order = await createOrder(parsed.data);
    return Response.json({ id: order.id, number: order.number }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderError) {
      return Response.json({ error: error.message }, { status: 409 });
    }
    console.error("Création de commande impossible :", error);
    return Response.json({ error: "La commande n'a pas pu être enregistrée. Réessayez dans un instant." }, { status: 500 });
  }
}
