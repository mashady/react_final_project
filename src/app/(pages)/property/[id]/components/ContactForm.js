"use client";
import LoadingButton from "./LoadingButton";
import FormError from "./FormError";
export default function ContactForm({
  contactForm,
  setContactForm,
  submittingContact,
  contactError,
  onSubmit,
}) {
  return (
    <form
      className="flex flex-col gap-4 bg-[#f7f7f7] p-6 rounded-xl border border-[#ececec] shadow-sm"
      onSubmit={onSubmit}
    >
      <input
        className="w-full p-3 rounded-lg border border-[#ececec] focus:border-[#eab308] focus:ring-2 focus:ring-[#eab308] text-lg text-[#222] bg-white"
        type="text"
        placeholder="Your Name"
        value={contactForm.name}
        onChange={(e) =>
          setContactForm({ ...contactForm, name: e.target.value })
        }
        disabled={submittingContact}
      />
      <input
        className="w-full p-3 rounded-lg border border-[#ececec] focus:border-[#eab308] focus:ring-2 focus:ring-[#eab308] text-lg text-[#222] bg-white"
        type="email"
        placeholder="Your Email"
        value={contactForm.email}
        onChange={(e) =>
          setContactForm({ ...contactForm, email: e.target.value })
        }
        disabled={submittingContact}
      />
      <textarea
        className="w-full p-3 rounded-lg border border-[#ececec] focus:border-[#eab308] focus:ring-2 focus:ring-[#eab308] text-lg text-[#222] bg-white min-h-[80px] resize-none"
        placeholder="Message"
        value={contactForm.message}
        onChange={(e) =>
          setContactForm({ ...contactForm, message: e.target.value })
        }
        disabled={submittingContact}
      />
      {contactError && (
        <div className="text-red-500 text-base font-medium">{contactError}</div>
      )}
      <button
        type="submit"
        className="self-end bg-[#eab308] text-white px-6 py-2 rounded font-semibold hover:bg-[#c59d0b] transition-colors text-base"
        disabled={submittingContact}
      >
        {submittingContact ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
