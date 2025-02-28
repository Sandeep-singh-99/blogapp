import React from 'react'

export default function AdminLogin() {
  return (
    <div>
      <div>
        <h1>Admin Login</h1>
        <form>
          <div>
            <label>Email</label>
            <input type="email" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" />
          </div>
          <button>Login</button>
        </form>
      </div>
    </div>
  )
}
