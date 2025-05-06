<template>
    <transition name="modal-animation">
        <div v-show="loginModalActive" class="modal">
            <transition name="modal-animation-inner">
                <div v-show="loginModalActive" class="modal-inner">
                    <i @click="closeLoginModal" class="far fa-times-circle"></i>
                    <div class="modal-content">
                        <h2 class="mb-3 text-center">Login</h2>
                        <form action="/login" method="post">
                            <div class="form-control form-container text-center">
                                <label for="loginemail" class="form-label">Endereço E-mail</label>
                                <input type="email" id="loginemail" name="loginemail" class="form-control" required>
                                <label for="loginpassword" class="form-label">Palavra Passe</label>
                                <input type="password" id="loginpassword" name="loginpassword" class="form-control" required>
                            </div>
                            <div class="btn-container text-center">
                                <button type="button" class="btn btn-danger btn-cancelar" @click="closeLoginModal">Cancelar</button>
                                <button type="submit" class="btn btn-primary" @click="closeLoginModal">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>


<script>
    export default {
        props: ['loginModalActive'],
        setup(props, { emit }) {
            const closeLoginModal = () => {
                emit('closeLoginModal');
            }

            return { closeLoginModal }
        }
    }
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