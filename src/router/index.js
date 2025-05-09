import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomePage.vue'
import SearchView from '../views/public/EventsSearch.vue'
import FollowingView from '../views/public/FollowingLists.vue'
import ArtistDetailsView from '../views/public/ArtistDetails.vue'
import EventDetailsView from '../views/public/EventDetails.vue'

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
import AdminArtistsListView from '../views/Admin/ArtistsList.vue'
import AdminEventsListView from '../views/Admin/EventsList.vue'

//todo - add params on urls
const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/search',
        name: 'search',
        component: SearchView
    },
    {
        path: '/artist/:id',
        name: 'ArtistDetails',
        component: ArtistDetailsView
    },
    {
        path: '/event/:id',
        name: 'EventDetails',
        component: EventDetailsView
    },
    {
        path: '/backoffice',
        name: 'backoffice',
        component: BackOfficeHomeView
    },
    {
        path: '/backoffice/eventcreate',
        name: 'backofficeeventcreate',
        component: BackOfficeCreateEventView
    },
    {
        path: '/backoffice/edit',
        name: 'backofficeedit',
        component: BackOfficeEditEventView
    },
    {
        path: '/backoffice/stats',
        name: 'backofficestats',
        component: BackOfficeEventStatsView
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminHomeView
    },
    {
        path: '/admin/eventcreate',
        name: 'admineventcreate',
        component: AdminCreateEventView
    },
    {
        path: '/admin/edit',
        name: 'adminedit',
        component: AdminEditEventView
    },
    {
        path: '/admin/event',
        name: 'admineventdetails',
        component: AdminEventDetailsView
    },
    {
        path: '/admin/tickets',
        name: 'admintickets',
        component: AdminTicketsListView
    },
    {
        path: '/admin/users',
        name: 'adminusers',
        component: AdminUsersListView
    },
    {
        path: '/admin/artists',
        name: 'adminartists',
        component: AdminArtistsListView
    },
    {
        path: '/admin/events',
        name: 'adminevents',
        component: AdminEventsListView
    },
]

const router = createRouter({
    history: createWebHistory(),
  routes
})

export default router
