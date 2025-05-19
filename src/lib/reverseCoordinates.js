export async function reverseCoordinates(latlng) {
  const { lat, lng } = latlng;
  const apiKey = process.env.NEXT_PUBLIC_MAP_TRANSLATE;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const result = data.results[0];
    const components = result.components;
    const city =
      components.city ||
      components.town ||
      components.village ||
      components.hamlet;

    console.log('city: ', city);
    return city;
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return null;
  }
}
