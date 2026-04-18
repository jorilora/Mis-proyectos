import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileBarChart, LogOut, KeyRound } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import ChangePasswordModal from '@/components/auth/ChangePasswordModal'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clientes' },
  { to: '/reports', icon: FileBarChart, label: 'Reportes' },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const { logout, user } = useAuth()
  const [showChangePassword, setShowChangePassword] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-brand text-white min-h-screen">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-xl font-bold">Cartera en Mora</h1>
          <p className="text-xs text-blue-300 mt-1">{user?.username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === to ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700/50'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-blue-700">
          <button
            onClick={() => setShowChangePassword(true)}
            className="flex items-center gap-3 px-7 py-3 text-blue-200 hover:text-white text-sm w-full"
          >
            <KeyRound size={18} /> Cambiar contraseña
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-7 py-3 text-blue-200 hover:text-white text-sm w-full"
          >
            <LogOut size={18} /> Salir
          </button>
        </div>
      </aside>
      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} />

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand border-t border-blue-700 z-50">
        <div className="flex">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex-1 flex flex-col items-center py-2 text-xs',
                pathname === to ? 'text-white' : 'text-blue-300'
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex-1 flex flex-col items-center py-2 text-xs text-blue-300"
          >
            <LogOut size={20} />
            Salir
          </button>
        </div>
      </nav>
    </>
  )
}
