import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Protected } from "./components/Protected";
import { Admin } from "./pages/Admin";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { ListingWizard } from "./pages/ListingWizard";
import { PropertyDetail } from "./pages/PropertyDetail";
import { Provider } from "./pages/Provider";
import { Search } from "./pages/Search";

function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-bold uppercase text-sea">ZebeEstate</p>
      <h1 className="mt-2 text-3xl font-black">Page not found</h1>
      <p className="mt-3 text-slate-600">The requested page is not available.</p>
    </main>
  );
}

export function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/property/:slug" element={<PropertyDetail />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/dashboard" element={<Protected roles={["seeker", "landlord", "agent", "admin"]}><Dashboard /></Protected>} />
        <Route path="/dashboard/listings/new" element={<Protected roles={["landlord", "agent", "admin"]}><ListingWizard /></Protected>} />
        <Route path="/provider" element={<Protected roles={["landlord", "agent", "admin"]}><Provider /></Protected>} />
        <Route path="/zebeclaw" element={<Protected roles={["admin"]}><Admin /></Protected>} />
        <Route path="/admin" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
