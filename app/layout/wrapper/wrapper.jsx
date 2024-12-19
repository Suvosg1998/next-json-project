import dynamic from "next/dynamic";

const Header = dynamic(() => import("../header/header"));
const Footer = dynamic(() => import("../footer/footer"));

const Wrapper = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Wrapper;
