import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { generateToken } from '@/lib/auth';

// 3001 wala JWT secret — dono projects mein same hona chahiye
const BRIDGE_SECRET = process.env.BRIDGE_SECRET || 'my-3001-jwt-secret';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token missing' }, { status: 400 });
    }

    // 3001 ka JWT verify karo - try multiple secrets
    let decoded;
    const secretsToTry = [
      BRIDGE_SECRET,
      JWT_SECRET,
      'my-3001-jwt-secret',
      'my-super-secret-key-123',
      'your-secret-key-change-this'
    ];

    let verificationError;
    for (const secret of secretsToTry) {
      try {
        decoded = jwt.verify(token, secret);
        console.log(`✓ Token verified successfully with secret: ${secret.substring(0, 10)}...`);
        break;
      } catch (err) {
        verificationError = err;
        continue;
      }
    }

    if (!decoded) {
      console.error('Token verification failed with all secrets');
      console.error('Last error:', verificationError.message);
      console.error('Token received:', token);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token',
        details: verificationError.message 
      }, { status: 401 });
    }

    console.log('Decoded token:', decoded);

    // decoded mein se user details nikalo
    // (jo 3001 ne JWT mein store kiye the — id, email, username)
    // Handle both 'id' and 'userId' formats
    const external_user_id = decoded.id || decoded.userId;
    const email = decoded.email;
    const username = decoded.username;

    if (!external_user_id || !email || !username) {
      console.error('Missing required fields in token:', { external_user_id, email, username });
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token structure' 
      }, { status: 400 });
    }

    // 3000 ke DB mein user check karo
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    let user;

    if (existing.length > 0) {
      user = existing[0];

      // external_user_id update karo agar missing ho
      if (!user.external_user_id) {
        await pool.query(
          'UPDATE users SET external_user_id = ? WHERE id = ?',
          [external_user_id, user.id]
        );
      }
    } else {
      // Naya user create karo
      const [result] = await pool.query(
        `INSERT INTO users (username, email, password, role_id, external_user_id)
         VALUES (?, ?, 'EXTERNAL_USER', 3, ?)`,
        [username, email, external_user_id]
      );

      const [newUser] = await pool.query(
        'SELECT * FROM users WHERE id = ?',
        [result.insertId]
      );
      user = newUser[0];
    }

    // 3000 ka apna token generate karo
    const newToken = generateToken(user);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        external_user_id: user.external_user_id,
      },
      token: newToken
    });

    // Cookie set karo
    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    



    return response;
  } catch (error) {
    console.error('Set token error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
