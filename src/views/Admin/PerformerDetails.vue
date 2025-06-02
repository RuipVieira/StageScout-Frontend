<template>
    <div class="page-content-container py-4 px-3">
        <div class="card shadow-sm mb-4 fixed-card-top">
            <div class="card-header">
                <h5 class="mb-0">{{ group.name }}</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <h6>Informação Geral</h6>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Género</label>
                            <div class="text-muted">{{ group.genre }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Origem</label>
                            <div class="text-muted">{{ group.nationality }}</div>
                        </div>
                        <div class="mb-2">
                            <label class="form-label mb-0 small">Ano de Formação</label>
                            <div class="text-muted">{{ group.yearFormed }}</div>
                        </div>
                        <div class="btn-container text-center">
                            <button type="button" class="btn btn-primary" @click="openEditPerformerInformationModal()">Editar Informação</button>
                        </div>
                    </div>

                    <div class="col-md-4 border-start">
                        <h6>Membros</h6>
                        <el-table :data="pagedMembers" empty-text="Nenhum dado disponível" class="short-table" style="width: 100%" size="small" border>
                            <el-table-column prop="id" label="id" v-if="false" />
                            <el-table-column prop="name" label="Nome" />
                            <el-table-column prop="nationality" label="Nacionalidade" />
                            <el-table-column prop="activeMember" label="Membro Atual">
                                <template #default="{ row }">
                                    <span>{{ row.activeMember ? 'Sim' : 'Não' }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination layout="prev, pager, next" size="small"
                                       :current-page="membersPagination.page"
                                       :page-size="membersPagination.pageSize"
                                       :total="group.artists.length"
                                       @current-change="onMembersPageChange" />
                        <div class="btn-container text-center">
                            <button type="button" class="btn btn-primary" @click="openEditPerformerArtistsModal()">Gerir Membros</button>
                        </div>
                    </div>

                    <div class="col-md-4 border-start">
                        <h6>Álbuns</h6>
                        <el-table :data="pagedAlbums" empty-text="Nenhum dado disponível" class="short-table" style="width: 100%" size="small" border>
                            <el-table-column prop="id" label="id" v-if="false" />
                            <el-table-column prop="title" label="Título" />
                            <el-table-column prop="releaseYear" label="Ano Lançamento" />
                        </el-table>
                        <el-pagination layout="prev, pager, next" size="small"
                                       :current-page="albumsPagination.page"
                                       :page-size="albumsPagination.pageSize"
                                       :total="group.albums.length"
                                       @current-change="onAlbumsPageChange" />
                        <div class="btn-container text-center">
                            <button type="button" class="btn btn-primary" @click="openEditPerformerAlbumsModal()">Gerir Albums</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow-sm fixed-card" style="height: 100%;">
            <div class="card-header">
                <h6 class="mb-0">Próximos Eventos</h6>
            </div>
            <div class="card-body">
                <el-table :data="pagedEvents" empty-text="Nenhum dado disponível" style="width: 100%">
                    <el-table-column prop="id" label="id" v-if="false" />
                    <el-table-column prop="name" label="Nome" />
                    <el-table-column prop="venue" label="Local" />
                    <el-table-column prop="startDate" label="Data de Início" />
                    <el-table-column prop="endDate" label="Data de Fim" />
                </el-table>
                <el-pagination layout="prev, pager, next"
                               :current-page="eventsPagination.page"
                               :page-size="eventsPagination.pageSize"
                               :total="group.scheduledEvents.length"
                               @current-change="onEventsPageChange" />
            </div>
        </div>
    </div>
    <ModalEditPerformerInformation @closeEditPerformerInformationModal="toggleModalEditPerformerInformation"
                                   :modalEditPerformerInformationActive="modalEditPerformerInformationActive"
                                   @refreshPerformerDetails="refreshPerformerDetails"
                                   :performerDetails="group" />

    <ModalEditPerformerArtists @closeEditPerformerArtistsModal="toggleModalEditPerformerArtists"
                               :modalEditPerformerArtistsActive="modalEditPerformerArtistsActive"
                               @refreshPerformerDetails="refreshPerformerDetails"
                               :performerDetails="group" />

    <ModalEditPerformerAlbums @closeEditPerformerAlbumsModal="toggleModalEditPerformerAlbums"
                               :modalEditPerformerAlbumsActive="modalEditPerformerAlbumsActive"
                               @refreshPerformerDetails="refreshPerformerDetails"
                               :performerDetails="group" />
</template>

<script>
    import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
    import axios from 'axios'
    import Swal from 'sweetalert2'
    import { authState } from '../../auth';
    import ModalEditPerformerInformation from '@/components/AdminComponents/SubComponents/modalEditPerformerInformation.vue';
    import ModalEditPerformerArtists from '@/components/AdminComponents/SubComponents/modalEditPerformerArtists.vue';
    import ModalEditPerformerAlbums from '@/components/AdminComponents/SubComponents/modalEditPerformerAlbums.vue';

    export default {
        name: 'ArtistDetails',
        components: {
            ElTable, ElTableColumn, ElPagination, ModalEditPerformerInformation, ModalEditPerformerArtists, ModalEditPerformerAlbums
        },
        data() {
            return {
                authState,
                group: {
                    artists: [],
                    albums: [],
                    scheduledEvents: []
                },
                performerId: null,
                followerState: false,
                eventsPagination: { page: 1, pageSize: 5 },
                membersPagination: { page: 1, pageSize: 4 },
                albumsPagination: { page: 1, pageSize: 4 },
                modalEditPerformerInformationActive: false,
                modalEditPerformerArtistsActive: false,
                modalEditPerformerAlbumsActive: false
            }
        },
        computed: {
            pagedMembers() {
                const start = (this.membersPagination.page - 1) * this.membersPagination.pageSize;
                return this.group.artists.slice(start, start + this.membersPagination.pageSize);
            },
            pagedAlbums() {
                const start = (this.albumsPagination.page - 1) * this.albumsPagination.pageSize;
                return this.group.albums.slice(start, start + this.albumsPagination.pageSize);
            },
            pagedEvents() {
                const start = (this.eventsPagination.page - 1) * this.eventsPagination.pageSize;
                return this.group.scheduledEvents.slice(start, start + this.eventsPagination.pageSize);
            }
        },
        mounted() {
            this.performerId = this.$route.params.id;
            this.fetchPerformerDetails(this.performerId);
            this.checkFollowerStatus(this.performerId);
        },
        methods: {
            onEventsPageChange(page) {
                this.eventsPagination.page = page;
            },
            onMembersPageChange(page) {
                this.membersPagination.page = page;
            },
            onAlbumsPageChange(page) {
                this.albumsPagination.page = page;
            },
            async ToggleFollowState() {
                try {
                    const response = await axios.post('https://localhost:7216/api/Performers/ToggleFollowPerformer', {
                        performerId: this.$route.params.id,
                        profileId: localStorage.getItem('profileId')
                    });

                    if (response.data.following == true) {
                        this.followerState = true;
                        Swal.fire('Sucesso', 'Começou a seguir este Performer.', 'success');
                    } else {
                        this.followerState = false;
                        Swal.fire('Sucesso', 'Deixou de seguir este Performer.', 'success');
                    }
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async fetchPerformerDetails(performerId) {
                try {
                    const response = await axios.get('https://localhost:7216/api/Performers/GetPerformerDetails', {
                        params: { performerId }
                    });

                    this.group = response.data || {
                        artists: [],
                        albums: [],
                        scheduledEvents: []
                    };
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async checkFollowerStatus() {
                try {
                    const response = await axios.post('https://localhost:7216/api/Performers/CheckFollowingStatus', {
                        performerId: this.$route.params.id,
                        profileId: localStorage.getItem('profileId')
                    });

                    this.followerState = response.data.following === true;
                } catch (error) {
                    const message = error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            refreshPerformerDetails() {
                this.fetchPerformerDetails(this.$route.params.id);
            },
            toggleModalEditPerformerInformation() {
                this.modalEditPerformerInformationActive = !this.modalEditPerformerInformationActive;
                if (!this.modalEditPerformerInformationActive) {
                    this.refreshPerformerDetails();
                }
                return this.modalEditPerformerInformationActive;
            },
            openEditPerformerInformationModal() {
                this.modalEditPerformerInformationActive = true;
            },
            openEditPerformerArtistsModal() {
                this.modalEditPerformerArtistsActive = true;
            },
            toggleModalEditPerformerArtists() {
                this.modalEditPerformerArtistsActive = !this.modalEditPerformerArtistsActive;
                if (!this.modalEditPerformerArtistsActive) {
                    this.refreshPerformerDetails();
                }
                return this.modalEditPerformerArtistsActive;
            },
            openEditPerformerAlbumsModal() {
                this.modalEditPerformerAlbumsActive = true;
            },
            toggleModalEditPerformerAlbums() {
                this.modalEditPerformerAlbumsActive = !this.modalEditPerformerAlbumsActive;
                if (!this.modalEditPerformerAlbumsActive) {
                    this.refreshPerformerDetails();
                }
                return this.modalEditPerformerAlbumsActive;
            }
        }
    }
</script>




<style scoped>
    .fixed-card-top {
        width: 100%; 
        height: 370px; 
        overflow: hidden; 
        margin-bottom: 1rem;
    }

        
        .fixed-card-top .card-body {
            overflow-y: auto;
            padding: 0.75rem;
        }

        .fixed-card-top .card-header {
            background-color: transparent;
            border-bottom: 1px solid #dee2e6;
        }

    .fixed-card {
        width: 100%; 
        height: 400px;
        overflow: hidden; 
        margin-bottom: 1rem; 
    }

        .fixed-card .card-body {
            overflow-y: auto;
            padding: 0.75rem;
        }

        .fixed-card .card-header {
            background-color: transparent;
            border-bottom: 1px solid #dee2e6;
        }

    .n-data-table {
        font-size: 0.8rem;
    }
</style>