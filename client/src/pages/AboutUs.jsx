import Navbar from "../components/Navbar";
import ai from '../../public/ai.png'

const features = [
    {
        title: "Multi Language Support",
        description: "Learn in your preferred language. Our platform supports multiple languages, making it easier for you to understand and engage with the content.",
        image: '/language.png',
    },
    {
        title: "AI Chat",
        description: "Get instant answers and personalized assistance from our AI-powered chat. Whether it's clarifying concepts, solving problems, or exploring new ideas—just ask.",
        image: "/ai.png",
    },
    {
        title: "MCQs",
        description: "Test your knowledge with a wide variety of Multiple Choice Questions. Practice regularly and track your progress with instant feedback.",
        image: "/mcq.png",
    },
    {
        title: "Flashcards",
        description: "Quickly review key concepts using flashcards. Perfect for memorization and reinforcement, helping you retain information more effectively.",
        image: "/flashcard.png",
    },
    {
        title: "FAQs",
        description: "Find answers to common questions and clear up any doubts. Our FAQ section provides helpful information to guide you through your learning journey.",
        image: "/faq.png",
    },
];

const About = () => {
    return (
        <>
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-6 py-12 ">
                <h2 className="text-4xl font-bold mb-12 text-center">Our Features</h2>

                <div className="space-y-20">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                                }`}
                        >
                            <img
                                src={feature.image}
                                alt={feature.title}
                                className="h-1/4 w-1/4 md:w-1/2 rounded-lg shadow-lg"
                            />

                            <div className="md:w-1/2 ml-20 mr-20">
                                <span className="inline-block mb-2 px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                                    Feature
                                </span>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default About;
