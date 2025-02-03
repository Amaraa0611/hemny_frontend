// components/Loyalty.jsx

const Loyalty = () => {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Loyalty Programs</h3>
          <p className="text-lg mb-8">Get rewarded with loyalty points from our partners.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg">Loyalty Program 1</div>
            <div className="bg-gray-100 p-6 rounded-lg">Loyalty Program 2</div>
            <div className="bg-gray-100 p-6 rounded-lg">Loyalty Program 3</div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Loyalty;
  