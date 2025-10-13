import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDashboardContent } from '@/hooks/useDashboardContent'
import {
  Users,
  Briefcase,
  Building,
  Eye,
  Edit,
  Plus,
  FileText
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function Dashboard() {
  const { stats, loading } = useDashboardContent()

  const dashboardStats = [
    {
      title: 'Hero Sections',
      value: stats.totalHeroes,
      icon: FileText,
      color: 'text-sky-600',
      bgColor: 'bg-sky-100',
      editLink: '/admin/hero'
    },
    {
      title: 'Team Members',
      value: stats.totalTeamMembers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      editLink: '/admin/team'
    },
    {
      title: 'Services',
      value: stats.totalServices,
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      editLink: '/admin/services'
    },
    {
      title: 'Clients',
      value: stats.totalClients,
      icon: Building,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      editLink: '/admin/clients'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border border-sky-600 border-t-transparent"></div>
      </div>
    )
  }

  const recentSections = [
    { name: 'Hero Section', href: '/admin/hero', description: 'Main landing section content' },
    { name: 'About Us', href: '/admin/about', description: 'Company information and mission' },
    { name: 'Services', href: '/admin/services', description: 'Service offerings and features' },
    { name: 'Team', href: '/admin/team', description: 'Team member profiles' },
    { name: 'Contact', href: '/admin/contact', description: 'Contact information and forms' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your website content</p>
        </div>
        <Button asChild>
          <Link to="/" target="_blank">
            <Eye className="w-4 h-4 mr-2" />
            Preview Website
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={stat.editLink}>
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={stat.editLink}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add New
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/hero">
                <Edit className="w-4 h-4 mr-2" />
                Edit Hero Section
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/team">
                <Users className="w-4 h-4 mr-2" />
                Add Team Member
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/services">
                <Briefcase className="w-4 h-4 mr-2" />
                Add New Service
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/admin/clients">
                <Building className="w-4 h-4 mr-2" />
                Add Client
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSections.map((section) => (
              <div key={section.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">{section.name}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={section.href}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Content Status */}
      <Card>
        <CardHeader>
          <CardTitle>Content Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stats.totalHeroes > 0 ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
              <span className="text-sm">Hero Sections: {stats.totalHeroes} ({stats.publishedHeroes} published)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stats.hasAboutContent ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
              <span className="text-sm">About Section: {stats.hasAboutContent ? 'Complete' : 'Not Set'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stats.hasContactContent ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
              <span className="text-sm">Contact Info: {stats.hasContactContent ? 'Complete' : 'Not Set'}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stats.totalServices > 0 ? 'bg-green-500' : 'bg-amber-500'} rounded-full`}></div>
              <span className="text-sm">Services: {stats.totalServices} Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stats.totalTeamMembers > 0 ? 'bg-green-500' : 'bg-amber-500'} rounded-full`}></div>
              <span className="text-sm">Team: {stats.totalTeamMembers} Members</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stats.totalClients > 0 ? 'bg-green-500' : 'bg-amber-500'} rounded-full`}></div>
              <span className="text-sm">Clients: {stats.totalClients} Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}