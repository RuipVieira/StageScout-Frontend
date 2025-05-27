<template>
    <transition name="modal-animation">
        <div v-show="modalEditPerformerAlbumsActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditPerformerAlbumsActive" class="modal-inner">
                    <i @click="closeEditPerformerAlbumsModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Performer</h2>
                        <form @submit.prevent="edit">
                            <div class="form-control form-container text-center">
                                <div class="mt-4 mb-2 text-center">
                                    <label class="form-label">Adicionar Album</label>
                                    <select v-model="AlbumToAdd" class="form-select" @change="addAlbum">
                                        <option disabled value="">Selecione um Album</option>
                                        <option v-for="a in availableAlbums" :key="a.id" :value="a.id">
                                            {{ a.nome }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="text-center">
                                <table class="table table-striped table-hover" style="cursor: pointer;">
                                    <thead>
                                        <tr>
                                            <th>Albums Selecionados</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="Album in pagedSelectedAlbums"
                                            :key="Album.id">
                                            <td @click="removeAlbum(Album.id)" title="Clique para remover">
                                                {{ Album.nome }}
                                            </td>
                                        </tr>
                                        <tr v-if="pagedSelectedAlbums.length === 0">
                                            <td colspan="2" class="text-center">Nenhum Album selecionado</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <nav v-if="pageCount > 1" aria-label="Album pagination">
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
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeEditPerformerAlbumsModal()">Cancelar</button>
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
        name: 'EditPerformerAlbumsModal',
        props: {
            modalEditPerformerAlbumsActive: Boolean,
            performerDetails: Object,
        },
        data() {
            return {
                allAlbums: [],
                selectedAlbums: [],
                paginationPage: 1,
                albumsPerPage: 5,
            };
        },
        computed: {
            availableAlbums() {
                const selectedIds = this.selectedAlbums.map((p) => p.id);
                return this.allAlbums.filter((p) => !selectedIds.includes(p.id));
            },
            pageCount() {
                return Math.ceil(this.selectedAlbums.length / this.albumsPerPage);
            },
            pagedSelectedAlbums() {
                const start = (this.paginationPage - 1) * this.albumsPerPage;
                return this.selectedAlbums.slice(start, start + this.albumsPerPage);
            },
        },
        watch: {
            modalEditPerformerAlbumsActive(val) {
                if (val) {
                    this.fetchAllAlbums();
                }
            },
            performerDetails: {
                immediate: true,
                handler(performerDetails) {
                    if (performerDetails) {
                        this.selectedAlbums = (performerDetails.albums || []).map((p) => ({
                            id: p.id,
                            nome: p.titulo,
                        })) || [];
                    } else {
                        this.selectedAlbums = [];
                    }
                    this.paginationPage = 1;
                    this.AlbumToAdd = "";
                },
            },
        },
        async created() {
            await this.fetchAllAlbums();
        },
        methods: {
            async fetchAllAlbums() {
                try {
                    const response = await axios.get(
                        "https://localhost:7216/api/Helper/GetAllAlbums"
                    );
                    this.allAlbums = response.data || [];
                } catch (error) {
                    Swal.fire("Erro", "Não foi possível carregar performers.", "error");
                }
            },
            addAlbum() {
                if (!this.AlbumToAdd) return;

                const Album = this.allAlbums.find(
                    (p) => p.id === Number(this.AlbumToAdd)
                );
                if (Album) {
                    this.selectedAlbums.push({
                        id: Album.id,
                        nome: Album.nome,
                        membroAtual: true,
                    });
                    this.AlbumToAdd = "";
                    this.paginationPage = this.pageCount;
                }
            },
            removeAlbum(id) {
                this.selectedAlbums = this.selectedAlbums.filter(
                    (p) => p.id !== id
                );
                if (
                    this.paginationPage > 1 &&
                    this.selectedAlbums.length <=
                    (this.paginationPage - 1) * this.albumsPerPage
                ) {
                    this.paginationPage--;
                }
            },
            async edit() {
                try {
                    console.log(this.performerDetails);
                    await axios.post('https://localhost:7216/api/Admin/EditPerformerAlbums', {
                        PerformerId: this.performerDetails.id,
                        AlbumIds: this.selectedAlbums.map(album => album.id)
                    });

                    Swal.fire('Sucesso', 'Performer editado com sucesso!', 'success');
                    this.closeEditPerformerAlbumsModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro ao editar. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            closeEditPerformerAlbumsModal() {

                this.$emit('closeEditPerformerAlbumsModal');
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
