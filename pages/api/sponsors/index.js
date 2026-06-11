// pages/api/sponsors/index.js

import db from '../../../lib/db' 

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await db.execute(
        `SELECT
           sponsor_id   AS sponsor_id,
           name,
           contact_email,
           contact_phone
         FROM Sponsor`
      )
      return res.status(200).json(rows)
    } catch (err) {
      console.error('API /api/sponsors GET error:', err)
      return res.status(500).json({ error: 'Could not load sponsors' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, contact_email, contact_phone } = req.body

      const [result] = await db.execute(
        `INSERT INTO Sponsor (name, contact_email, contact_phone)
         VALUES (?, ?, ?)`,
        [name, contact_email, contact_phone]
      )

      const newSponsor = {
        sponsor_id: result.insertId,
        name,
        contact_email,
        contact_phone
      }

      return res.status(201).json(newSponsor)
    } catch (err) {
      console.error('API /api/sponsors POST error:', err)
      return res.status(500).json({ error: 'Could not create sponsor' })
    }
  }

  // If we get here, the method is not GET or POST
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}

