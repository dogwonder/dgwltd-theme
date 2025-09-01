// src/11ty/_data/carbonData.js
import EleventyFetch from "@11ty/eleventy-fetch";

export default async function() {
  console.log("Fetching carbon data..."); // Debug log
  
  try {
    const [intensityData, generationData] = await Promise.all([
      EleventyFetch("https://api.carbonintensity.org.uk/intensity", {
        duration: "10m",
        type: "json"
      }),
      EleventyFetch("https://api.carbonintensity.org.uk/generation", {
        duration: "10m", 
        type: "json"
      })
    ]);

    console.log("Carbon data fetched successfully"); // Debug log
    
    return {
      intensity: intensityData,
      generation: generationData
    };
  } catch (error) {
    console.error('Error fetching carbon data:', error);
    return {
      intensity: { data: [{ intensity: { actual: 150 } }] }, // Fallback data
      generation: { data: { generationmix: [] } }
    };
  }
}