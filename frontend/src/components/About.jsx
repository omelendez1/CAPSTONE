export default function About() {
  return (
    <div className="text-center p-6 space-y-10">
      {/* Main Title */}
      <h2 className="text-3xl font-bold mb-4">About This App</h2>

      {/* --- Sub-banner with Rules --- */}
      <section className="mx-auto max-w-3xl">
        <div
          className="p-6 rounded-lg"
          style={{
            border: "10px solid rgb(229, 231, 235)",
            outline: "2px solid rgb(26, 26, 26)",
            outlineOffset: "-6px",
          }}
        >
          <h3 className="text-2xl font-semibold mb-4">Rules of the Game</h3>
          <p className="text-gray-700 leading-relaxed">
            In the spirit of the original Pokémon journey, this app allows you to
            discover and collect not just the original 150 Pokémon, but many more
            from generations beyond. Like the classic games, the thrill lies in
            uncovering new creatures, expanding your Pokédex, and building your
            dream team.
          </p>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="mx-auto max-w-3xl space-y-4">
        <h3 className="text-2xl font-semibold">How It Works</h3>
        <p className="text-gray-700 leading-relaxed">
          To get started, you’ll create an account. Every day, you can claim free
          tokens to generate random Pokémon cards. Each token lets you reveal one
          random card. Your collection gallery keeps track of all the cards you’ve
          discovered so far. Rare cards have a special place in your collection, 
          encouraging you to keep exploring and completing your Pokédex.
        </p>

        {/* Responsive Intro Video */}
        <div className="relative w-full pb-[56.25%] h-0 mt-4 rounded-lg overflow-hidden shadow-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/Offw-N3PkoA"
            title="Pokémon History Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          *This video is streamed from YouTube but can later be replaced with a
          locally hosted file for offline support.
        </p>
      </section>

      {/* --- History Section --- */}
      <section className="mx-auto max-w-3xl space-y-4">
        <h3 className="text-2xl font-semibold">History of Pokémon Commercials</h3>
        <p className="text-gray-700 leading-relaxed">
          Pokémon’s journey into pop culture was fueled by iconic commercials and
          unforgettable marketing campaigns. Take a nostalgic trip back to where
          it all started and relive the excitement that captured a generation.
        </p>

        {/* Responsive History Video */}
        <div className="relative w-full pb-[56.25%] h-0 mt-4 rounded-lg overflow-hidden shadow-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/kD366fd1dIs"
            title="Pokémon Commercials History"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          *This is a linked video but can be swapped with a self-hosted file later for better integration.
        </p>
      </section>

      {/* --- Future Features Section --- */}
      <section className="mx-auto max-w-3xl space-y-4">
        <h3 className="text-2xl font-semibold">Future Features</h3>
        <p className="text-gray-700 leading-relaxed">
          We’re planning to expand the experience with exciting new features:
        </p>
        <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>Trading System:</strong> Trade your duplicate cards with
            other users online.
          </li>
          <li>
            <strong>Barter & Rarity Value:</strong> Cards will have rarity scores,
            making some cards more valuable than others.
          </li>
          <li>
            <strong>Special Events:</strong> Limited-time events where you can
            earn exclusive cards.
          </li>
        </ul>
        <p className="text-gray-700 leading-relaxed">
          These updates aim to recreate the joy of the original Pokémon card
          trading experience while adding a modern, digital twist.
        </p>
      </section>
    </div>
  );
}