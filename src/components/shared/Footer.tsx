import { Mail } from 'lucide-react';
import { Input } from '../ui/input';

const Footer = () => {
  return (
    <footer className="bg-dark-100 w-full border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto text-light-100 px-4">
        <div className="grid md:grid-cols-4 gap-10">
          {/* CONNECT WITH US */}
          <div>
            <h3 className="text-lg font-semibold text-light-200 mb-4">CONNECT WITH US</h3>
            <p className="text-neutral-300 mb-2">
              Km. 10 Idiroko Road, Canaan Land,<br />
              Ota, Ogun State, Nigeria
            </p>
            <div className="flex items-center space-x-2 text-sm text-light-100">
              <Mail className="h-4 w-4" />
              <span>aocl@covenantuniversity.edu.ng</span>
            </div>
          </div>

          {/* COLLEGES */}
          <div>
            <h3 className="text-lg font-semibold text-light-200 mb-4">COLLEGES</h3>
            <ul className="text-neutral-300 space-y-2 text-sm">
              <li>Engineering</li>
              <li>Leadership & Development Studies</li>
              <li>Management & Social Sciences</li>
              <li>Science & Technology</li>
              <li>Postgraduate Studies</li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h3 className="text-lg font-semibold text-light-200 mb-4">RESOURCES</h3>
            <ul className="text-neutral-300 space-y-2 text-sm">
              <li>Admissions</li>
              <li>Campus & Facilities</li>
              <li>Journals & Articles</li>
              <li>Scholarship</li>
              <li>Documents & Policies</li>
            </ul>
          </div>

          {/* SEARCH */}
          <div>
            <h3 className="text-lg font-semibold text-light-200 mb-4">SEARCH</h3>
              <Input
                type="text"
                placeholder="Search..."
                className="form-input"
              />
              {/* <Search className="h-4 w-4 text-muted-foreground" /> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
