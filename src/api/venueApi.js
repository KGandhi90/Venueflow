const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const venueApi = {
  getStatus:         ()           => apiFetch('/api/venue/status'),
  getOrders:         ()           => apiFetch('/api/orders'),
  createOrder:       (body)       => apiFetch('/api/orders', 
                                      { method: 'POST', body: JSON.stringify(body) }),
  updateOrderStatus: (id, status) => apiFetch(`/api/orders/${id}`,
                                      { method: 'PATCH', body: JSON.stringify({ status }) }),
  getStaff:          ()           => apiFetch('/api/staff'),
  updateStaffStatus: (id, status) => apiFetch(`/api/staff/${id}`,
                                      { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAlerts:         ()           => apiFetch('/api/alerts'),
  resolveAlert:      (id)         => apiFetch(`/api/alerts/${id}/resolve`,
                                      { method: 'PATCH' }),
  broadcastAlert:    (body)       => apiFetch('/api/alerts/broadcast',
                                      { method: 'POST', body: JSON.stringify(body) }),
  chat:              (body)       => apiFetch('/api/chat',
                                      { method: 'POST', body: JSON.stringify(body) }),
};
