export default function LocalTipsPage() {
    return (
      <main className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Local Suggestions</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 text-center">
          Here are some recommended spots to eat, drink, and unwind — all within walking distance of James Square.
        </p>
  
        <div className="space-y-16">
  
          <section>
            <h2 className="text-2xl font-semibold mb-6">🍽️ Restaurants</h2>
  
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-semibold">La Casa</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">6a Roseburn Terrace, EH12 5NG – Cosy, family-run tapas restaurant serving classic Spanish small plates and wine in a warm and relaxed setting.</p>
                <img
                  src="/images/venues/la-casa.jpg"
                  alt="La Casa restaurant"
                  className="w-full max-w-md rounded-lg shadow mx-auto"
                />
              </div>
  
              <div>
                <h3 className="text-xl font-semibold">First Coast</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">97-101 Dalry Road, EH11 2AB – Modern Scottish bistro using seasonal ingredients, with an ever-changing menu and a casual but refined atmosphere.</p>
                <img
                  src="/images/venues/first-coast.jpg"
                  alt="First Coast restaurant"
                  className="w-full max-w-md rounded-lg shadow mx-auto"
                />
              </div>
  
              <div>
                <h3 className="text-xl font-semibold">Locanda De Gusti</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">102 Dalry Road, EH11 2DW – Authentic Neapolitan dining experience with seafood and pasta specials, run by a passionate Italian chef and team.</p>
                <img
                  src="/images/venues/locanda.jpg"
                  alt="Locanda De Gusti restaurant"
                  className="w-full max-w-md rounded-lg shadow mx-auto"
                />
              </div>
  
              <div>
                <h3 className="text-xl font-semibold">Sushiya</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">19 Dalry Road, EH11 2BQ – A tiny gem of a sushi bar offering high-quality nigiri, sashimi and rolls, made fresh by skilled Japanese chefs.</p>
                <img
                  src="/images/venues/sushiya.jpg"
                  alt="Sushiya restaurant"
                  className="w-full max-w-md rounded-lg shadow mx-auto"
                />
              </div>
  
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-10">
                <li><strong>Kuzina</strong> – Vibrant Greek street food with wraps and gyros.</li>
                <li><strong>Pizza Geeks</strong> – Neapolitan-style pizza with geeky names and amazing dough.</li>
              </ul>
            </div>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-6">🍔 Fast Food & Takeaways</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li><strong>Wingstop</strong> – US-style chicken wings in bold flavours (Fountain Park).</li>
              <li><strong>Five Guys</strong> – Classic American burgers and fries (Fountain Park).</li>
              <li><strong>Hollywood Burgers & Shakes</strong> – Casual burger joint with indulgent desserts.</li>
              <li><strong>Kebabish Original</strong> – Hearty Indian grill with sizzling mixed platters.</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold mb-6">🍻 Bars & Pubs</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li><strong>The Fountain</strong> – Modern pub with comfort food and Sunday roasts.</li>
              <li><strong>Old Pal</strong> – Stylish cocktail bar in Haymarket with vintage charm.</li>
              <li><strong>Malones Irish Bar</strong> – Sports, live music and a proper pint of Guinness.</li>
              <li><strong>Teuchters</strong> – Traditional whisky bar with local beers and hearty Scottish food.</li>
            </ul>
          </section>
  
        </div>
      </main>
    );
  }
  