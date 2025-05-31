<template>
    <transition name="modal-animation">
        <div v-show="modalEditMusicGenreActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditMusicGenreActive" class="modal-inner">
                    <i @click="closeEditMusicGenreModal" class="far fa-times-circle" style="cursor:pointer; font-size: 1.5rem;"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Género Musical</h2>
                        <form @submit.prevent="Edit">
                            <div class="form-control form-container text-center">
                                <label for="selectedMusicGenreName" class="form-label">Nome</label>
                                <input type="text"
                                       v-model="selectedMusicGenreName"
                                       id="selectedMusicGenreName"
                                       class="form-control"
                                       required />
                            </div>
                            <div class="btn-container text-center mt-4">
                                <button type="button"
                                        class="btn btn-danger btn-cancelar"
                                        @click="closeEditMusicGenreModal()">
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
        name: "EditMusicGenreModal",
        props: {
            modalEditMusicGenreActive: Boolean,
            genre: Object,
        },
        data() {
            return {
                selectedMusicGenreName: "",
            };
        },
        watch: {
            genre: {
                immediate: true,
                handler(genre) {
                    if (genre) {
                        this.selectedMusicGenreName = genre.name || "";
                    } else {
                        this.selectedMusicGenreName = "";
                    }
                },
            },
        },
        methods: {
            async Edit() {
                try {
                    await axios.post("https://localhost:7216/api/Admin/EditMusicGenre", {
                        GenreId: this.genre?.id,
                        Name: this.selectedMusicGenreName,
                    });

                    Swal.fire("Sucesso", "Género atualizado com sucesso!", "success");
                    this.closeEditMusicGenreModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Erro ao atualizar. Tente novamente.";
                    Swal.fire("Erro", message, "error");
                }
            },
            closeEditMusicGenreModal() {
                this.selectedMusicGenreName = "";
                this.$emit("closeEditMusicGenreModal");
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
