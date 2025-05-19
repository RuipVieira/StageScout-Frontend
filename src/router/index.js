import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomePage.vue'
import EventSearch from '../views/public/EventSearch.vue'
import PerformerSearch from '../views/public/PerformerSearch.vue'
import PerformerDetailsView from '../views/public/PerformerDetails.vue'
import EventDetailsView from '../views/public/EventDetails.vue'
import UnauthorizedView from '../views/public/Unauthorized.vue'

import BackOfficeHomeView from '../views/BackOffice/HomePage.vue'
import BackOfficeCreateEventView from '../views/BackOffice/CreateEvent.vue'
import BackOfficeEditEventView from '../views/BackOffice/EditEvent.vue'
import BackOfficeEventStatsView from '../views/BackOffice/EventStatistics.vue'

import AdminHomeView from '../views/Admin/HomePage.vue'
import AdminCreateEventView from '../views/Admin/CreateEvent.vue'
import AdminEditEventView from '../views/Admin/EditEvent.vue'
import AdminEventDetailsView from '../views/Admin/EventDetails.vue'
import AdminTicketsListView from '../views/Admin/TicketsList.vue'
import AdminUsersListView from '../views/Admin/UsersList.vue'
import AdminPerformersListView from '../views/Admin/PerformersList.vue'
import AdminEventsListView from '../views/Admin/EventsList.vue'

//todo - add params on urls
const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/event/:id',
        name: 'EventDetails',
        component: EventDetailsView,
        meta: { requiresAuth: true, roles: ['user', 'promoter', 'admin'] }
    },
    {
        path: '/events',
        name: 'EventSearch',
        component: EventSearch,
        meta: { requiresAuth: true, roles: ['user', 'promoter', 'admin'] }
    },
    {
        path: '/performer',
        name: 'PerformerSearch',
        component: PerformerSearch,
        meta: { requiresAuth: true, roles: ['user', 'promoter', 'admin'] }
    },
    {
        path: '/performer/:id',
        name: 'PerformerDetails',
        component: PerformerDetailsView,
        meta: { requiresAuth: true, roles: ['user', 'promoter', 'admin'] }
    },
    {
        path: '/backoffice',
        name: 'backoffice',
        component: BackOfficeHomeView,
        meta: { requiresAuth: true, roles: ['promoter'] }
    },
    {
        path: '/backoffice/eventcreate',
        name: 'backofficeeventcreate',
        component: BackOfficeCreateEventView,
        meta: { requiresAuth: true, roles: ['promoter'] }
    },
    {
        path: '/backoffice/edit',
        name: 'backofficeedit',
        component: BackOfficeEditEventView,
        meta: { requiresAuth: true, roles: ['promoter'] }
    },
    {
        path: '/backoffice/stats',
        name: 'backofficestats',
        component: BackOfficeEventStatsView,
        meta: { requiresAuth: true, roles: ['promoter'] }
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminHomeView,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/eventcreate',
        name: 'admineventcreate',
        component: AdminCreateEventView,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/edit',
        name: 'adminedit',
        component: AdminEditEventView,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/event',
        name: 'admineventdetails',
        component: AdminEventDetailsView,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/tickets',
        name: 'admintickets',
        component: AdminTicketsListView,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/users',
        name: 'adminusers',
        component: AdminUsersListView,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/performers',
        name: 'adminPerformers',
        component: AdminPerformersListView,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/events',
        name: 'adminevents',
        component: AdminEventsListView,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/restrito',
        name: 'unauthorized',
        component: UnauthorizedView,
    }
]

const router = createRouter({
    history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('role')

    if (to.meta.requiresAuth) {
        if (!role) {
            next({ path: '/' })
        } else if (to.meta.roles && !to.meta.roles.includes(role)) {
            next({ path: '/restrito' })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
