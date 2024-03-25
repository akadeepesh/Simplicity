import Footer from "@/components/layout/footer";
import PoetriesCollection from "@/components/layout/poetries-collection";

const Main = () => {
  return (
    <div>
      <main className="container max-w-2xl flex flex-col mt-28">
        <PoetriesCollection />
      </main>
      <Footer />
    </div>
  );
};

export default Main;
