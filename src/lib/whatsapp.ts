// Fabrique un lien qui ouvre une conversation WhatsApp, avec un message déjà écrit si on le souhaite.
// Ex. whatsappLink("221784303944", "Bonjour") → https://wa.me/221784303944?text=Bonjour
export function whatsappLink(phone: string, message?: string): string {
  const url = `https://wa.me/${phone}`;
  return message ? `${url}?text=${encodeURIComponent(message)}` : url;
}
