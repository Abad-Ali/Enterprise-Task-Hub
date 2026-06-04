import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full">
      <div className='flex justify-center items-center'>
        <Navbar/>
      </div>

      <div className="relative z-10">
        {children}
      </div>
      
      <div>
        <Footer/>
      </div>
    </div>
  );
}