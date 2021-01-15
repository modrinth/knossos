export default function ({ store, redirect }) {
  if (!store.state.auth.hasToken) {
    return redirect('/login')
  }
}
