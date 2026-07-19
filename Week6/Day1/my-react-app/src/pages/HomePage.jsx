import profilePic from '../assets/profile.jpg';
import StemBuilding from '../assets/stem.jpeg';

export default function HomePage() {
  return (
    <main className="flex-1 flex-col flex items-center justify-center space-y-6 py-10">

      <section className="flex text-start px-4 space-x-4">
        {/* Replace src below with: src={profilePic} after adding profile.jpg to src/assets/ */}
        <img
          src="src/assets/profile.jpg"
          alt="Profile"
          className="w-40 h-40 rounded-full shadow-lg border-4 border-white mb-6"
        />
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome to My React Site
          </h1>
          <p className="text-lg md:text-xl">
            Hello! I'm learning <span className="font-semibold text-blue-600">React</span>.
          </p>
        </div>
      </section>

      {/* Replace src below with: src={StemBuilding} after adding stem.jpeg to src/assets/ */}
      <img
        src="src/assets/stem.jpeg"
        alt="StemBuilding"
        className="max-w-3xl"
      />

    </main>
  );
}
