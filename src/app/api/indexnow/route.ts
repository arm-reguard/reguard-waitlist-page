export async function POST() {
  const urls = [
    'https://reguard.dev',
    'https://reguard.dev/calculator'
  ]
  
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'reguard.dev',
      key: '70f4d71edc07418e93eae8455ced4d46',
      keyLocation: 'https://reguard.dev/70f4d71edc07418e93eae8455ced4d46.txt',
      urlList: urls
    })
  })
  
  return Response.json({ 
    status: response.status,
    message: response.ok ? 'Submitted to IndexNow' : 'Failed'
  })
}

