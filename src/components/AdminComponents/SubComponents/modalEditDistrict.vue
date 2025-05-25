<template>
    <transition name="modal-animation">
        <div v-show="modalEditDistrictActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="modalEditDistrictActive" class="modal-inner">
                    <i @click="closeEditDistrictModal" class="far fa-times-circle" style="cursor:pointer; font-size: 1.5rem;"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Editar Localização</h2>
                        <form @submit.prevent="Edit">
                            <div class="form-control form-container text-center">
                                <label for="selectedDistrictName" class="form-label">Nome</label>
                                <input type="text"
                                       v-model="selectedDistrictName"
                                       id="selectedDistrictName"
                                       class="form-control"
                                       required />

                                <label for="selectedDistrictCountry" class="form-label">País</label>
                                <select id="selectedDistrictCountry" v-model="selectedDistrictCountry" class="form-control">
                                    <option v-for="nation in nationsList" :key="nation.id" :value="nation.id">
                                        {{ nation.descricao }}
                                    </option>
                                </select>
                            </div>
                            <div class="btn-container text-center mt-4">
                                <button type="button"
                                        class="btn btn-danger btn-cancelar"
                                        @click="closeEditDistrictModal()">
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
        name: "EditDistrictModal",
        props: {
            modalEditDistrictActive: Boolean,
            district: Object,
        },
        data() {
            return {
                selectedDistrictName: "",
                nationsList: [],
                selectedDistrictCountry: '',
            };
        },
        watch: {
            modalEditDistrictActive(val) {
                if (val) {
                    this.GetNations();
                }
            },
            district: {
                immediate: true,
                handler(district) {
                    if (district) {
                        this.selectedDistrictName = district.nome || "";
                        this.selectedDistrictCountry = district.pais?.id || '';
                    } else {
                        this.selectedDistrictName = "";
                        this.selectedDistrictCountry = '';
                    }
                },
            },
        },
        methods: {
            async GetNations() {
                try {
                    const response = await axios.get('https://localhost:7216/api/Helper/GetAllNations');
                    this.nationsList = response.data;
                }
                catch (error) {
                    const message =
                        error.response?.data?.message || 'Erro de pesquisa. Tente novamente.';
                    Swal.fire('Erro', message, 'error');
                }

            },
            async Edit() {
                try {
                    await axios.post("https://localhost:7216/api/Admin/EditDistrict", {
                        NaturalidadeId: this.district?.id,
                        Nome: this.selectedDistrictName,
                        NacionalidadeId: this.selectedDistrictCountry
                    });

                    Swal.fire("Sucesso", "Localização atualizada com sucesso!", "success");
                    this.closeEditDistrictModal();
                } catch (error) {
                    const message =
                        error.response?.data?.message || "Erro ao atualizar. Tente novamente.";
                    Swal.fire("Erro", message, "error");
                }
            },
            closeEditDistrictModal() {
                this.selectedDistrictName = "";
                this.selectedDistrictCountry = '';
                this.selectedDistrictDistrict = '';
                this.$emit("closeEditDistrictModal");
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
