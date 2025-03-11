
export default function handler(req, res) {
    res.status(200).json([
        {
            id: 1,
            name: "Buddy",
            age: 3,
            breed: "Golden Retriever",
            image: "/images/buddy.jpg",
            description: "Friendly and energetic."
        },
        {
            id: 2,
            name: "Mittens",
            age: 2,
            breed: "Tabby Cat",
            image: "/images/mittens.jpg",
            description: "Calm and affectionate."
        },
        // ...more pet data...
    ]);
}