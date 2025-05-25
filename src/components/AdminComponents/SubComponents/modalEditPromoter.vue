<template>
    <transition name="modal-animation">
        <div v-show="modalEditPromoterActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditPromoterActive" class="modal-inner">
                    <i @click="closeEditPromoterModal" class="far fa-times-circle" style="cursor:pointer; font-size: 1.5rem;"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Promotora</h2>
                        <form @submit.prevent="Edit">
                            <div class="form-control form-container text-center">
                                <label for="selectedPromoterName" class="form-label">Nome</label>
                                <input type="text"
                                       v-model="selectedPromoterName"
                                       id="selectedPromoterName"
                                       class="form-control"
                                       required />

                                <label for="selectedPromoterUserEmail" class="form-label">Email Gestor</label>
                                <select id="selectedPromoterUserEmail" v-model="selectedPromoterUserEmail" class="form-control">
                                    
                                    <option v-for="userEmail in userEmailsList" :key="userEmail" :value="userEmail">
                                        {{ userEmail }}
                                    </option>
                                </select>
                            </div>
                            <div class="btn-container text-center mt-4">
                                <button type="button"
                                        class="btn btn-danger btn-cancelar"
                                        @click="closeEditPromoterModal()">
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
        name: "EditPromoterModal",
        props: {
            modalEditPromoterActive: Boolean,
            promoter: Object,
        },
        data() {
            return {
                selectedPromoterName: "",
                selectedPromoterUserEmail: "",
                userEmailsList: [],
            };
        },
        watch: {
            modalEditPromoterActive(val) {
                if (val) {
                    this.GetUserEmails();
                }
            },
            promoter: {
                immediate: true,
                handler(promoter) {
                    if (promoter) {
                        this.selectedPromoterName = promoter.nome || "";
                        this.selectedPromoterUserEmail = promoter.accountEmail || '';
                    } else {
                        this.selectedPromoterName = "";
                        this.selectedPromoterUserEmail = '';
                    }
                },
            },
        },
        methods: {
            async GetUserEmails() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetPromoterAccounts');
                    this.userEmailsList = response.data;
                } catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }
            },
            async Edit() {
                try {
                    await axios.post("https://localhost:7216/api/Admin/EditPromoter", {
                        PromoterId: this.promoter?.id,
                        Nome: this.selectedPromoterName.trim(),
                        Email: this.selectedPromoterUserEmail,
                    });

                    Swal.fire("Sucesso", "Promotora atualizada com sucesso!", "success");
                    this.closeEditPromoterModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Erro ao atualizar. Tente novamente.";
                    Swal.fire("Erro", message, "error");
                }
            },
            closeEditPromoterModal() {
                this.selectedPromoterName = "";
                this.selectedPromoterUserEmail = '';
                this.$emit("closeEditPromoterModal");
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
