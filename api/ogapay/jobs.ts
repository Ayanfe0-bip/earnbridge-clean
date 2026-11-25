export async function GET(request: Request) {
  const apiKey = process.env.OGAPAY_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        success: false,
        error: 'OgaPay integration is not configured.',
      },
      { status: 500 }
    );
  }

  const incomingUrl = new URL(request.url);
  const params = new URLSearchParams();

  const category = incomingUrl.searchParams.get('category');
  const search = incomingUrl.searchParams.get('search');
  const page = incomingUrl.searchParams.get('page');
  const limit = incomingUrl.searchParams.get('limit');

  if (category) {
    params.set('category', category.slice(0, 40));
  }

  if (search) {
    params.set('search', search.slice(0, 100));
  }

  if (page && /^[1-9]\d*$/.test(page)) {
    params.set('page', String(Math.min(Number(page), 1000)));
  }

  params.set(
    'limit',
    limit && /^[1-9]\d*$/.test(limit)
      ? String(Math.min(Number(limit), 50))
      : '20'
  );

  try {
    const response = await fetch(
      `https://ogapay.app/api/v1/dev/jobs?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('OgaPay error:', response.status);

      return Response.json(
        {
          success: false,
          error: 'OgaPay could not load opportunities right now.',
        },
        { status: 502 }
      );
    }

    return Response.json(data, {
      status: 200,
      headers: {
        'Cache-Control':
          's-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('OgaPay connection error:', error);

    return Response.json(
      {
        success: false,
        error: 'Could not connect to OgaPay.',
      },
      { status: 502 }
    );
  }
}
