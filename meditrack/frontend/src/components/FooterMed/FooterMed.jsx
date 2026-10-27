import FooterBrand from "./FooterBrand.jsx";
import FooterLinks from "./FooterLinks.jsx";
import FooterNewsletter from "./FooterNewsletter.jsx";
import FooterBottom from "./FooterBottom.jsx";

function FooterMed() {
  return (
    <footer className="bg-[#070D14] text-slate-100 mt-auto pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-slate-900">
          <div className="lg:col-span-4">
            <FooterBrand />
          </div>
          <div className="lg:col-span-5">
            <FooterLinks />
          </div>
          <div className="lg:col-span-3">
            <FooterNewsletter />
          </div>
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}

export default FooterMed;
