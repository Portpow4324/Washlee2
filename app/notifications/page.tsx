'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Card from '@/components/Card'
import { Bell, Check, Trash2, Archive, AlertCircle, Zap, Gift, DollarSign, Clock } from 'lucide-react'
import { collection, query, where, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Notification {
  id: string
  title: string
  body: string
  type: 'order_update' | 'promo' | 'points' | 'alert' | 'system'
  read: boolean
  archived: boolean
  createdAt: any
  data?: any
  icon?: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user, userData, loading: authLoading } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return

    const notificationsRef = collection(db, 'notifications')
    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Notification))

      setNotifications(docs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const markAsRead = async (notificationId: string) => {
    try {
      const notifDoc = doc(db, 'notifications', notificationId)
      await updateDoc(notifDoc, { read: true })
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const archiveNotification = async (notificationId: string) => {
    try {
      const notifDoc = doc(db, 'notifications', notificationId)
      await updateDoc(notifDoc, { archived: true })
    } catch (error) {
      console.error('Error archiving:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId))
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'archived') return n.archived
    return !n.archived
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_update':
        return <Clock size={20} className="text-blue-500" />
      case 'promo':
        return <Gift size={20} className="text-pink-500" />
      case 'points':
        return <DollarSign size={20} className="text-green-500" />
      case 'alert':
        return <AlertCircle size={20} className="text-orange-500" />
      default:
        return <Bell size={20} className="text-gray-500" />
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray">Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Notifications</h1>
          <p className="text-gray">Stay updated on your orders and special offers</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-dark border-2 border-gray hover:bg-gray/10'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'unread'
                ? 'bg-primary text-white'
                : 'bg-white text-dark border-2 border-gray hover:bg-gray/10'
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'archived'
                ? 'bg-primary text-white'
                : 'bg-white text-dark border-2 border-gray hover:bg-gray/10'
            }`}
          >
            Archived
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell size={48} className="mx-auto mb-4 text-gray/50" />
            <p className="text-gray">No notifications yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 pt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-semibold text-dark">{notification.title}</h3>
                        <p className="text-gray text-sm mt-1">{notification.body}</p>
                        {notification.data && (
                          <p className="text-xs text-gray/70 mt-2">
                            {new Date(notification.createdAt.toDate()).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition flex items-center gap-1"
                        >
                          <Check size={14} />
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => archiveNotification(notification.id)}
                        className="text-xs px-3 py-1 bg-gray/10 text-gray rounded hover:bg-gray/20 transition flex items-center gap-1"
                      >
                        <Archive size={14} />
                        Archive
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
