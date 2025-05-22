<template>
    <div class="page-content-container">
        <h1 class="mb-4 text-center">StageScout - Administração</h1>
        <div class="row">
            <div v-for="entity in entities" :key="entity.name" class="col-md-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">{{ entity.name }}</h5>
                        <div class="d-flex gap-2 mt-3">
                            <button v-if="entity.name === 'Nacionalidades e Naturalidades'"
                                    class="btn btn-success"
                                    @click="openCreateNationalityModal()">
                                Nova Nacionalidade
                            </button>
                            <button v-if="entity.name === 'Nacionalidades e Naturalidades'"
                                    class="btn btn-info"
                                    @click="openCreateNaturalityModal()">
                                Nova Naturalidade
                            </button>
                            <button v-if="entity.name === 'Albums'"
                                    class="btn btn-success"
                                    @click="openCreateAlbumModal()">
                                Criar Novo
                            </button>
                            <button v-else-if="entity.name === 'Localizações'"
                                    class="btn btn-success"
                                    @click="openCreateVenueModal()">
                                Criar Novo
                            </button>
                            <button v-else-if="entity.name === 'Promotoras'"
                                    class="btn btn-success"
                                    @click="openCreatePromoterModal()">
                                Criar Novo
                            </button>
                            <button v-else-if="entity.name === 'Géneros Musicais'"
                                    class="btn btn-success"
                                    @click="openCreateMusicGenreModal()">
                                Criar Novo
                            </button>
                            <button v-else-if="entity.name === 'Performers'"
                                    class="btn btn-success"
                                    @click="openCreatePerformerModal()">
                                Criar Novo
                            </button>
                            <button v-else-if="entity.name === 'Utilizadores'"
                                    class="btn btn-success"
                                    @click="openCreateUserModal()">
                                Criar Novo
                            </button>
                            <button v-else-if="entity.name === 'Eventos'"
                                    class="btn btn-success"
                                    @click="openCreateEventModal()">
                                Criar Novo
                            </button>
                            <button v-else-if="entity.name === 'Artistas'"
                                    class="btn btn-success"
                                    @click="openCreateArtistModal()">
                                Criar Novo
                            </button>
                            <button v-else-if="entity.name !== 'Nacionalidades e Naturalidades'"
                                    class="btn btn-success"
                                    @click="$emit(entity.createModal)">
                                Criar Novo
                            </button>
                            <button class="btn btn-primary" @click="goTo(entity.manageRoute)">Gerir e Editar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <CreateAlbumModal @closeCreateAlbumModal="toggleModalCreateAlbum" :modalCreateAlbumActive="modalCreateAlbumActive" />
    <CreateArtistModal @closeCreateArtistModal="toggleModalCreateArtist" :modalCreateArtistActive="modalCreateArtistActive" />
    <CreateMusicGenreModal @closeCreateMusicGenreModal="toggleModalCreateMusicGenre" :modalCreateMusicGenreActive="modalCreateMusicGenreActive" />
    <CreateEventModal @closeCreateEventModal="toggleModalCreateEvent" :modalCreateEventActive="modalCreateEventActive" />
    <CreateVenueModal @closeCreateVenueModal="toggleModalCreateVenue" :modalCreateVenueActive="modalCreateVenueActive" />
    <CreateNationalityModal @closeCreateNationalityModal="toggleModalCreateNationality" :modalCreateNationalityActive="modalCreateNationalityActive" />
    <CreateNaturalityModal @closeCreateNaturalityModal="toggleModalCreateNaturality" :modalCreateNaturalityActive="modalCreateNaturalityActive" />
    <CreatePerformerModal @closeCreatePerformerModal="toggleModalCreatePerformer" :modalCreatePerformerActive="modalCreatePerformerActive" />
    <CreatePromoterModal @closeCreatePromoterModal="toggleModalCreatePromoter" :modalCreatePromoterActive="modalCreatePromoterActive" />
    <CreateUserModal @closeCreateUserModal="toggleModalCreateUser" :modalCreateUserActive="modalCreateUserActive" />
</template>

<script>
    import CreateArtistModal from '../../Components/AdminComponents/SubComponents/modalCreateArtist.vue';
    import CreateAlbumModal from '../../Components/AdminComponents/SubComponents/modalCreateAlbum.vue';
    import CreateMusicGenreModal from '../../Components/AdminComponents/SubComponents/modalCreateMusicGenre.vue';
    import CreateEventModal from '../../Components/AdminComponents/SubComponents/modalCreateEvent.vue';
    import CreateVenueModal from '../../Components/AdminComponents/SubComponents/modalCreateVenue.vue';
    import CreateNationalityModal from '../../Components/AdminComponents/SubComponents/modalCreateNationality.vue';
    import CreateNaturalityModal from '../../Components/AdminComponents/SubComponents/modalCreateNaturality.vue';
    import CreatePerformerModal from '../../Components/AdminComponents/SubComponents/modalCreatePerformer.vue';
    import CreatePromoterModal from '../../Components/AdminComponents/SubComponents/modalCreatePromoter.vue';
    import CreateUserModal from '../../Components/AdminComponents/SubComponents/modalCreateUser.vue';

    export default {
        name: 'AdminDashboard',
        components: {
            CreateArtistModal, CreateAlbumModal, CreateMusicGenreModal, CreateEventModal, CreateVenueModal, CreateNationalityModal, CreateNaturalityModal, CreatePerformerModal, CreatePromoterModal, CreateUserModal
        },
        data() {
            return {
                modalCreateAlbumActive: false,
                modalCreateArtistActive: false,
                modalCreateMusicGenreActive: false,
                modalCreateEventActive: false,
                modalCreateVenueActive: false,
                modalCreateNationalityActive: false,
                modalCreateNaturalityActive: false,
                modalCreatePerformerActive: false,
                modalCreatePromoterActive: false,
                modalCreateUserActive: false,
                entities: [
                    { name: 'Albums', createModal: 'openAlbumCreateModal', manageRoute: 'AdminAlbumSearch' },
                    { name: 'Artistas', createModal: 'openArtistCreateModal', manageRoute: 'AdminArtistSearch' },
                    { name: 'Eventos', createModal: 'openEventCreateModal', manageRoute: 'AdminEventSearch' },
                    { name: 'Géneros Musicais', createModal: 'openGenreCreateModal', manageRoute: 'AdminGenreSearch' },
                    { name: 'Localizações', createModal: 'openVenueCreateModal', manageRoute: 'AdminVenueSearch' },
                    { name: 'Nacionalidades e Naturalidades', createModal: null, manageRoute: 'AdminLocationSearch' },
                    { name: 'Performers', createModal: 'openPerformerCreateModal', manageRoute: 'AdminPerformerSearch' },
                    { name: 'Promotoras', createModal: 'openPromoterCreateModal', manageRoute: 'AdminPromoterSearch' },
                    { name: 'Utilizadores', createModal: 'openUserCreateModal', manageRoute: 'AdminUserSearch' }
                ]
            };
        },
        methods: {
            goTo(routeName) {
                this.$router.push({ name: routeName });
            },
            toggleModalCreateArtist() {
                this.modalCreateArtistActive = !this.modalCreateArtistActive;
                return this.modalCreateArtistActive;
            },
            openCreateArtistModal() {
                this.modalCreateArtistActive = true;
            },
            toggleModalCreateAlbum() {
                this.modalCreateAlbumActive = !this.modalCreateAlbumActive;
                return this.modalCreateAlbumActive;
            },
            openCreateAlbumModal() {
                this.modalCreateAlbumActive = true;
            },
            toggleModalCreateMusicGenre() {
                this.modalCreateMusicGenreActive = !this.modalCreateMusicGenreActive;
                return this.modalCreateMusicGenreActive;
            },
            openCreateMusicGenreModal() {
                this.modalCreateMusicGenreActive = true;
            },
            toggleModalCreateEvent() {
                this.modalCreateEventActive = !this.modalCreateEventActive;
                return this.modalCreateEventActive;
            },
            openCreateEventModal() {
                this.modalCreateEventActive = true;
            },
            toggleModalCreateVenue() {
                this.modalCreateVenueActive = !this.modalCreateVenueActive;
                return this.modalCreateVenueActive;
            },
            openCreateVenueModal() {
                this.modalCreateVenueActive = true;
            },
            toggleModalCreateNationality() {
                this.modalCreateNationalityActive = !this.modalCreateNationalityActive;
                return this.modalCreateNationalityActive;
            },
            openCreateNationalityModal() {
                this.modalCreateNationalityActive = true;
            },
            toggleModalCreateNaturality() {
                this.modalCreateNaturalityActive = !this.modalCreateNaturalityActive;
                return this.modalCreateNaturalityActive;
            },
            openCreateNaturalityModal() {
                this.modalCreateNaturalityActive = true;
            },
            toggleModalCreatePerformer() {
                this.modalCreatePerformerActive = !this.modalCreatePerformerActive;
                return this.modalCreatePerformerActive;
            },
            openCreatePerformerModal() {
                this.modalCreatePerformerActive = true;
            },
            toggleModalCreatePromoter() {
                this.modalCreatePromoterActive = !this.modalCreatePromoterActive;
                return this.modalCreatePromoterActive;
            },
            openCreatePromoterModal() {
                this.modalCreatePromoterActive = true;
            },
            toggleModalCreateUser() {
                this.modalCreateUserActive = !this.modalCreateUserActive;
                return this.modalCreateUserActive;
            },
            openCreateUserModal() {
                this.modalCreateUserActive = true;
            }
        }
    };
</script>

<style scoped>
    .page-content-container {
        padding: 20px;
    }

    .card {
        border-radius: 8px;
        overflow: hidden;
    }

    .card-body {
        padding: 1rem;
    }

    .card-title {
        font-size: 1.1rem;
        font-weight: 500;
    }

    .d-flex {
        display: flex;
        gap: 10px;
        justify-content: space-between;
    }

    .btn {
        width: 48%;
    }

    @media (max-width: 768px) {
        .col-md-4 {
            width: 100%;
        }
    }
</style>
