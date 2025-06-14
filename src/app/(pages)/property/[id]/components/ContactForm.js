"use client";
import LoadingButton from "./LoadingButton";
import FormError from "./FormError";
export default function ContactForm({ contactForm, setContactForm, submittingContact, contactError, onSubmit }) {
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="space-y-2 mt-4">
      <input
        className="w-full border rounded p-2"
        placeholder="Your Name"
        value={contactForm.name}
        onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
      />
      <input
        className="w-full border rounded p-2"
        placeholder="Your Email"
        value={contactForm.email}
        onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
      />
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        placeholder="Message"
        value={contactForm.message}
        onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
      />
      {contactError && <FormError message={contactError} />}
      <LoadingButton loading={submittingContact} type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">
        Send Message
      </LoadingButton>
    </form>
  );
}
