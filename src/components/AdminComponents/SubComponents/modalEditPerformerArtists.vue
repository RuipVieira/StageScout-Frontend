<template>
    <transition name="modal-animation">
        <div v-show="modalEditPerformerArtistsActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditPerformerArtistsActive" class="modal-inner">
                    <i @click="closeEditPerformerArtistsModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Performer</h2>
                        <form @submit.prevent="edit">
                            <div class="form-control form-container text-center">
                                <div class="mt-4 mb-2 text-center">
                                    <label class="form-label">Adicionar Artista</label>
                                    <select v-model="artistToAdd" class="form-select" @change="addArtist">
                                        <option disabled value="">Selecione um artista</option>
                                        <option v-for="a in availableArtists" :key="a.id" :value="a.id">
                                            {{ a.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="text-center">
                                <table class="table table-striped table-hover" style="cursor: pointer;">
                                    <thead>
                                        <tr>
                                            <th>Artistas Selecionados</th>
                                            <th class="text-center">É Membro Atual?</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="artist in pagedSelectedArtists"
                                            :key="artist.id">
                                            <td @click="removeArtist(artist.id)" title="Clique para remover">
                                                {{ artist.name }}
                                            </td>
                                            <td class="text-center">
                                                <input type="checkbox"
                                                       v-model="artist.activeMember"
                                                       title="Membro atual" />
                                            </td>
                                        </tr>
                                        <tr v-if="pagedSelectedArtists.length === 0">
                                            <td colspan="2" class="text-center">Nenhum artista selecionado</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <nav v-if="pageCount > 1" aria-label="Artist pagination">
                                    <ul class="pagination justify-content-center">
                                        <li class="page-item"
                                            :class="{ disabled: paginationPage === 1 }"
                                            @click="changePage(paginationPage - 1)">
                                            <a class="page-link" href="#" tabindex="-1">Anterior</a>
                                        </li>
                                        <li v-for="page in pageCount"
                                            :key="page"
                                            class="page-item"
                                            :class="{ active: page === paginationPage }"
                                            @click="changePage(page)">
                                            <a class="page-link" href="#">{{ page }}</a>
                                        </li>
                                        <li class="page-item"
                                            :class="{ disabled: paginationPage === pageCount }"
                                            @click="changePage(paginationPage + 1)">
                                            <a class="page-link" href="#">Próximo</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeEditPerformerArtistsModal()">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
    import axios from 'axios';
    import Swal from 'sweetalert2';

    export default {
        name: 'EditPerformerArtistsModal',
        props: {
            modalEditPerformerArtistsActive: Boolean,
            performerDetails: Object,
        },
        data() {
            return {
                allArtists: [],
                selectedArtists: [],
                paginationPage: 1,
                artistsPerPage: 5,
            };
        },
        computed: {
            availableArtists() {
                const selectedIds = this.selectedArtists.map((p) => p.id);
                return this.allArtists.filter((p) => !selectedIds.includes(p.id));
            },
            pageCount() {
                return Math.ceil(this.selectedArtists.length / this.artistsPerPage);
            },
            pagedSelectedArtists() {
                const start = (this.paginationPage - 1) * this.artistsPerPage;
                return this.selectedArtists.slice(start, start + this.artistsPerPage);
            },
        },
        watch: {
            modalEditPerformerArtistsActive(val) {
                if (val) {
                    this.fetchAllArtists();
                }
            },
            performerDetails: {
                immediate: true,
                handler(performerDetails) {
                    if (performerDetails) {
                        this.selectedArtists = (performerDetails.artists || []).map((p) => ({
                            id: p.id,
                            name: p.name,
                            activeMember: p.activeMember ?? false,
                        })) || [];
                    } else {
                        this.selectedArtists = [];
                    }
                    this.paginationPage = 1;
                    this.artistToAdd = "";
                },
            },
        },
        async created() {
            await this.fetchAllArtists();
        },
        methods: {
            changePage(page) {
                if (page >= 1 && page <= this.pageCount) {
                    this.paginationPage = page;
                }
            },
            async fetchAllArtists() {
                try {
                    const response = await axios.get(
                        "https://localhost:7216/api/Helper/GetAllArtists"
                    );
                    this.allArtists = response.data || [];
                } catch (error) {
                    Swal.fire("Erro", "Não foi possível carregar performers.", "error");
                }
            },
            addArtist() {
                if (!this.artistToAdd) return;

                const artist = this.allArtists.find(
                    (p) => p.id === Number(this.artistToAdd)
                );
                if (artist) {
                    this.selectedArtists.push({
                        id: artist.id,
                        name: artist.name,
                        activeMember: true,
                    });
                    this.artistToAdd = "";
                    this.paginationPage = this.pageCount;
                }
            },
            removeArtist(id) {
                this.selectedArtists = this.selectedArtists.filter(
                    (p) => p.id !== id
                );
                if (
                    this.paginationPage > 1 &&
                    this.selectedArtists.length <=
                    (this.paginationPage - 1) * this.artistsPerPage
                ) {
                    this.paginationPage--;
                }
            },
            async edit() {
                try {
                    await axios.post('https://localhost:7216/api/Admin/EditPerformerArtists', {
                        PerformerId: this.performerDetails.id,
                        Artists: this.selectedArtists.map((p) => ({
                            ArtistId: p.id,
                            ActiveMember: p.activeMember,
                        })),
                    });

                    Swal.fire('Sucesso', 'Performer editado com sucesso!', 'success');
                    this.closeEditPerformerArtistsModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao editar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeEditPerformerArtistsModal() {

                this.$emit('closeEditPerformerArtistsModal');
                this.$emit('refreshPerformerDetails');
            },
        }
    };
</script>

<style scoped>
    .modal-animation-enter-active,
    .modal-animation-leave-active {
        transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
    }

    .modal-animation-enter-from,
    .modal-animation-leave-to {
        opacity: 0;
    }

    .modal-animation-inner-enter-active {
        transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
    }

    .modal-animation-inner-leave-active {
        transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
    }

    .modal-animation-inner-enter-from {
        opacity: 0;
        transform: scale(0.8);
    }

    .modal-animation-inner-leave-to {
        transform: scale(0.8);
    }

    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(255, 255, 255, 0.7);
        .modal-inner

    {
        position: relative;
        max-width: 300px;
        width: 80%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: #fff;
        padding: 50px 10px 10px 10px;
        i

    {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 20px;
        cursor: pointer;
        &:hover

    {
        color: crimson;
    }

    }
    }
    }
</style>
