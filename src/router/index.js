import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/public/HomePage.vue'
import EventSearch from '../views/public/EventSearch.vue'
import PerformerSearch from '../views/public/PerformerSearch.vue'
import PerformerDetailsView from '../views/public/PerformerDetails.vue'
import EventDetailsView from '../views/public/EventDetails.vue'
import UnauthorizedView from '../views/public/Unauthorized.vue'

import BackOfficeHomeView from '../views/BackOffice/HomePage.vue'
import BackOfficeEditEventView from '../views/BackOffice/EditEvent.vue'
import BackOfficeEventStatsView from '../views/BackOffice/EventStatistics.vue'

import AdminHomeView from '../views/Admin/HomePage.vue'
import AdminAlbumSearch from '../views/Admin/AlbumSearch.vue'
import AdminArtistSearch from '../views/Admin/ArtistSearch.vue'
import AdminEventSearch from '../views/Admin/EventSearch.vue'
import AdminGenreSearch from '../views/Admin/GenreSearch.vue'
import AdminPerformerSearch from '../views/Admin/PerformerSearch.vue'
import AdminPromoterSearch from '../views/Admin/PromoterSearch.vue'
import AdminUserSearch from '../views/Admin/UserSearch.vue'
import AdminVenueSearch from '../views/Admin/VenueSearch.vue'
import AdminEventDetails from '../views/Admin/EventDetails.vue'
import AdminPerformerDetails from '../views/Admin/PerformerDetails.vue'
import AdminDistrictSearch from '../views/Admin/DistrictSearch.vue'

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
        name: 'BackOfficeHomeView',
        component: BackOfficeHomeView,
        meta: { requiresAuth: true, roles: ['promoter'] }
    },
    {
        path: '/backoffice/edit/:id',
        name: 'BackOfficeEditEventView',
        component: BackOfficeEditEventView,
        meta: { requiresAuth: true, roles: ['promoter'] }
    },
    {
        path: '/backoffice/stats/:id',
        name: 'BackOfficeEventStatsView',
        component: BackOfficeEventStatsView,
        meta: { requiresAuth: true, roles: ['promoter'] }
    },
    {
        path: '/admin',
        name: 'AdminHomeView',
        component: AdminHomeView,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/albums',
        name: 'AdminAlbumSearch',
        component: AdminAlbumSearch,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/artists',
        name: 'AdminArtistSearch',
        component: AdminArtistSearch,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/events',
        name: 'AdminEventSearch',
        component: AdminEventSearch,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/genres',
        name: 'AdminGenreSearch',
        component: AdminGenreSearch,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/performers',
        name: 'AdminPerformerSearch',
        component: AdminPerformerSearch,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/promoters',
        name: 'AdminPromoterSearch',
        component: AdminPromoterSearch,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/users',
        name: 'AdminUserSearch',
        component: AdminUserSearch,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/venues',
        name: 'AdminVenueSearch',
        component: AdminVenueSearch,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/event/:id',
        name: 'AdminEventDetails',
        component: AdminEventDetails,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/performer/:id',
        name: 'AdminPerformerDetails',
        component: AdminPerformerDetails,
        meta: { requiresAuth: true, roles: ['admin'] }
    },
    {
        path: '/admin/districts/',
        name: 'AdminDistrictSearch',
        component: AdminDistrictSearch,
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
