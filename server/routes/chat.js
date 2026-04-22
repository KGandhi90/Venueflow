import { Router } from 'express'
import { store }  from '../store/inMemoryStore.js'

const router = Router()

const SYSTEM_PROMPT = `
You are VenueFlow AI — the official smart assistant for 
Horizon Arena, a 50,000-seat stadium currently hosting 
City FC vs United FC (Matchday 22, match in progress).

You help attendees with anything they need inside the venue.
You have full knowledge of the following:

VENUE LAYOUT:
- 6 entry/exit gates: Gate A (North), Gate B (Northeast), 
  Gate C (East — Medical Centre here), Gate D (Southeast), 
  Gate E (South), Gate F (West — Accessible entry)
- 4 food courts: Court 1 (Gate A side), Court 2 (Central),
  Court 3 (Gate E side), Court 4 (Upper Level)
- 12 restroom blocks: R1–R12 distributed across all levels
  Closest to Gate A: R1. Upper tier: R11. Gate D area: R7.
- Lifts: near Gates A and D
- Lost & Found: Gate A, staffed during the event
- Medical Centre: Gate C, red cross signs from any concourse
- Accessible facilities: Gates A, C, and F

CURRENT LIVE CONDITIONS (approximate):
- 38,247 attendees checked in
- Lowest wait gate right now: Gate D (2 min)
- Highest wait gate right now: Gate E (11 min)
- Quickest restroom: Block R11 Upper Tier (1 min)
- Quickest food: Court 4 Upper Level (2 min)
- Avg wait across venue: 5.4 min
- Match currently at 67 minutes

MENU HIGHLIGHTS:
- Classic Burger ₹350, Nachos ₹220, Paneer Wrap ₹280,
  Chicken Tikka Roll ₹320, Cola ₹120, Cold Coffee ₹160
- City FC Jersey ₹1200, Team Cap ₹450, Scarf ₹300

YOUR PERSONALITY:
- Friendly, warm, and concise — like a helpful local guide
- Never robotic or overly formal
- Always give a specific actionable answer, never vague
- If asked for directions, give landmarks and gate references
- Keep all responses under 60 words — this is a mobile chat
- Never say "I'm an AI" or "As an AI" — just be the assistant
- If you don't know something specific, give the best 
  general guidance and suggest asking staff at Gate A
`

function getMockResponse(input = '') {
  const msg = input.toLowerCase()
  if (msg.includes('restroom') || msg.includes('toilet'))
    return "Nearest restroom is Block R1 near Gate A — just 2 min wait right now. Block R11 on the upper tier is also free!"
  if (msg.includes('food') || msg.includes('eat') || msg.includes('hungry'))
    return "Food Court 4 on the upper level has the shortest queue — about 2 minutes. Court 2 in the central zone is also quick at 4 min!"
  if (msg.includes('lost') || msg.includes('bag') || msg.includes('phone'))
    return "Head to Lost & Found at Gate A — staff there can help you right away. Describe the item and they'll log it for you."
  if (msg.includes('halftime') || msg.includes('break'))
    return "Halftime is around the 45' mark. Pro tip: head to restrooms or food in the first 3 minutes of the break before queues build up!"
  if (msg.includes('wheelchair') || msg.includes('accessible'))
    return "Accessible facilities are at Gates A, C, and F. Lifts are near Gates A and D. Gate F is the easiest accessible entry point."
  if (msg.includes('medical') || msg.includes('first aid') || msg.includes('doctor'))
    return "Medical centre is near Gate C — follow the red cross signs from any concourse. The response team is on-site throughout the event."
  return "Happy to help! Ask me about restrooms, food courts, wait times, lost items, accessibility, or anything else about Horizon Arena."
}

// POST /api/chat
router.post('/', async (req, res) => {
  const { message, history = [] } = req.body
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return res.json({ reply: getMockResponse(message) })
  }

  // Build conversation history — ensure it ends with user message
  const contents = [
    ...history,
    { role: 'user', parts: [{ text: message }] },
  ]

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const geminiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: 200,
          temperature:     0.7,
        },
      }),
    })

    if (!geminiRes.ok) {
      const errData = await geminiRes.json()
      console.error('[chat] Gemini error:', errData?.error?.message)
      return res.json({ reply: getMockResponse(message) })
    }

    const data  = await geminiRes.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      ?? getMockResponse(message)

    res.json({ reply })
  } catch (err) {
    console.error('[chat] fetch error:', err.message)
    // Never return 5xx for AI failures — degrade gracefully
    res.json({ reply: getMockResponse(message) })
  }
})

export default router
