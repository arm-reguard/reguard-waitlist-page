import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Submit to BOTH Google Sheets AND Web3Forms
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVB-2oGa16Ebde7ZvbSTtWLpGpB-HxxIHk0ouxUhK-dtg5EN14cx0HDSmNeovUZeh0/exec';
    const WEB3FORMS_ACCESS_KEY = 'f10d1628-c29b-4396-9e93-813535429473';

    // 1. Submit to Google Sheets (primary storage)
    const googleResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const googleResult = await googleResponse.json();

    // 2. Submit to Web3Forms (email notifications)
    const web3FormData = new FormData();
    web3FormData.append('access_key', WEB3FORMS_ACCESS_KEY);
    web3FormData.append('email', email);
    web3FormData.append('subject', 'New Waitlist Signup - reGuard');
    web3FormData.append('from_name', 'reGuard Waitlist');

    // Send to Web3Forms (don't wait for response, fire and forget)
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: web3FormData,
    }).catch(err => console.log('Web3Forms notification failed:', err));

    // Return success if Google Sheets worked (main requirement)
    if (googleResult.success) {
      return NextResponse.json({ 
        success: true,
        serialNumber: googleResult.serialNumber 
      });
    } else if (googleResult.error === 'duplicate') {
      // Email already exists in waitlist
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 } // 409 Conflict
      );
    } else {
      console.error('Google Sheets error:', googleResult);
      return NextResponse.json(
        { error: 'Failed to submit' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

