import React, { useActionState } from "react";
import { useAuth } from "../authContext/UserCotenxt";
import { loginApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
function LoginForm() {
  const { setUser } = useAuth();

  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(
    async (prev, formData) => {
      try {
        const payload = Object.fromEntries(formData.entries());
        const data = await loginApi(payload);
        setUser?.(data.user);

        setTimeout(() => {
          navigate("/");
        }, 2000);
        return { ok: true, message: data.message || "Welcome" };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    },
    { ok: false, error: null, message: null }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
      <img src="/logo.png" alt=""/>

      <div>
        <form action={formAction} class="max-w-md mx-auto">
          <div class="relative z-0 w-full mb-5 group"></div>
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="floating_email"
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              for="floating_email"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="password"
              id="floating_password"
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              for="floating_repeat_password"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              {" "}
              password
            </label>
          </div>

          <button
            type="submit"
            class="text-white bg-primary  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            {isPending ? "Submitting" : "Login"}
          </button>

          {!state.ok && state.error && (
            <p className="text-red-600 mt-3">{state.error}</p>
          )}

          {state.ok && state.message && (
            <p className="text-green-600 mt-3">{state.message}</p>
          )}
          <p className="mt-5">
            Don't Have an account ?{" "}
            <a className="ml-2 text-blue-600" href="/register">
              Create Account
            </a>{" "}
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
