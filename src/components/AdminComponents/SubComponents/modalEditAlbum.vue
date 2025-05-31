<template>
    <transition name="modal-animation">
        <div v-show="modalEditAlbumActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditAlbumActive" class="modal-inner">
                    <i @click="closeEditAlbumModal" class="far fa-times-circle" style="cursor:pointer; font-size: 1.5rem;"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Album</h2>
                        <form @submit.prevent="Edit">
                            <div class="form-control form-container text-center">
                                <label for="selectedAlbumName" class="form-label">Nome</label>
                                <input type="text"
                                       v-model="selectedAlbumName"
                                       id="selectedAlbumName"
                                       class="form-control"
                                       required />

                                <label for="selectedAlbumYear" class="form-label">Ano de Lançamento</label>
                                <input type="number"
                                       v-model="selectedAlbumYear"
                                       id="selectedAlbumYear"
                                       class="form-control"
                                       required
                                       min="1200"
                                       step="1" />


                                <div class="mt-4 mb-2 text-center">
                                    <label class="form-label">Adicionar Performer</label>
                                    <select v-model="performerToAdd" class="form-select" @change="addPerformer">
                                        <option disabled value="">Selecione um performer</option>
                                        <option v-for="p in availablePerformers" :key="p.id" :value="p.id">
                                            {{ p.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>  
                            <div class="text-center">
                                <table class="table table-striped table-hover" style="cursor: pointer;">
                                    <thead>
                                        <tr>
                                            <th>Performers Selecionados</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="performer in pagedSelectedPerformers"
                                            :key="performer.id"
                                            @click="removePerformer(performer.id)"
                                            title="Clique para remover">
                                            <td>{{ performer.name }}</td>
                                        </tr>
                                        <tr v-if="pagedSelectedPerformers.length === 0">
                                            <td class="text-center">Nenhum performer selecionado</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <nav v-if="pageCount > 1" aria-label="Performer pagination">
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

                            <div class="btn-container text-center mt-4">
                                <button type="button"
                                        class="btn btn-danger btn-cancelar"
                                        @click="closeEditAlbumModal()">
                                    Cancelar
                                </button>
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
    import axios from "axios";
    import Swal from "sweetalert2";

    export default {
        name: "EditAlbumModal",
        props: {
            modalEditAlbumActive: Boolean,
            album: Object,
        },
        data() {
            return {
                selectedAlbumName: "",
                selectedAlbumYear: "",
                allPerformers: [], 
                selectedPerformers: [], 
                performerToAdd: "", 
                paginationPage: 1,
                performersPerPage: 5,
            };
        },
        computed: {
            availablePerformers() {
                const selectedIds = this.selectedPerformers.map((p) => p.id);
                return this.allPerformers.filter((p) => !selectedIds.includes(p.id));
            },
            pageCount() {
                return Math.ceil(this.selectedPerformers.length / this.performersPerPage);
            },
            pagedSelectedPerformers() {
                const start = (this.paginationPage - 1) * this.performersPerPage;
                return this.selectedPerformers.slice(start, start + this.performersPerPage);
            },
        },
        watch: {
            album: {
                immediate: true,
                handler(album) {
                    if (album) {
                        this.selectedAlbumName = album.name || "";
                        this.selectedAlbumYear = album.releaseYear || "";
                        this.selectedPerformers =
                            (album.albumPerformers || []).map((p) => ({
                                id: p.id,
                                name: p.name,
                            })) || [];
                    } else {
                        this.selectedAlbumName = "";
                        this.selectedAlbumYear = "";
                        this.selectedPerformers = [];
                    }
                    this.paginationPage = 1;
                    this.performerToAdd = "";
                },
            },
        },
        async created() {
            await this.fetchAllPerformers();
        },
        methods: {
            async fetchAllPerformers() {
                try {
                    const response = await axios.get(
                        "https://localhost:7216/api/Helper/GetAllPerformers"
                    );
                    this.allPerformers = response.data || [];
                } catch (error) {
                    Swal.fire("Erro", "Não foi possível carregar performers.", "error");
                }
            },
            addPerformer() {
                if (!this.performerToAdd) return;

                const performer = this.allPerformers.find(
                    (p) => p.id === Number(this.performerToAdd)
                );
                if (performer) {
                    this.selectedPerformers.push(performer);
                    this.performerToAdd = "";
                    this.paginationPage = this.pageCount;
                }
            },
            removePerformer(id) {
                this.selectedPerformers = this.selectedPerformers.filter(
                    (p) => p.id !== id
                );
                if (
                    this.paginationPage > 1 &&
                    this.selectedPerformers.length <=
                    (this.paginationPage - 1) * this.performersPerPage
                ) {
                    this.paginationPage--;
                }
            },
            changePage(page) {
                if (page < 1 || page > this.pageCount) return;
                this.paginationPage = page;
            },
            async Edit() {
                try {
                    await axios.post("https://localhost:7216/api/Admin/EditAlbum", {
                        AlbumId: this.album?.id,
                        Name: this.selectedAlbumName,
                        ReleaseYear: this.selectedAlbumYear,
                        Performers: this.selectedPerformers.map((p) => p.id),
                    });

                    Swal.fire("Sucesso", "Album atualizado com sucesso!", "success");
                    this.closeEditAlbumModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Erro ao atualizar. Tente novamente.";
                    Swal.fire("Erro", message, "error");
                }
            },
            closeEditAlbumModal() {
                this.selectedAlbumName = "";
                this.selectedAlbumYear = "";
                this.selectedPerformers = [];
                this.performerToAdd = "";
                this.paginationPage = 1;
                this.$emit("closeEditAlbumModal");
            },
        },
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
