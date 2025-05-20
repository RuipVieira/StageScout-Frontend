<template>
    <div class="page-content-container">
        <h1 class="mb-4 text-center">StageScout - Administração</h1>
        <div class="row">
            <div v-for="entity in entities" :key="entity.name" class="col-md-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">{{ entity.name }}</h5>
                        <div class="d-flex gap-2 mt-3">
                            <button v-if="entity.name === 'Localidades'"
                                    class="btn btn-success"
                                    @click="$emit('openNationalityCreateModal')">
                                Nova Nacionalidade
                            </button>
                            <button v-if="entity.name === 'Localidades'"
                                    class="btn btn-info"
                                    @click="$emit('openDistrictCreateModal')">
                                Nova Naturalidade
                            </button>
                            <button v-else
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
</template>

<script>
    export default {
        name: 'AdminDashboard',
        data() {
            return {
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
