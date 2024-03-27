import Footer from "@/components/layout/footer";
import PoetriesCollection from "@/components/layout/poetries-collection";

const Main = () => {
  return (
    <div>
      <div className="container max-w-2xl flex flex-col mt-14 md:mt-28">
        <PoetriesCollection />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
