import createApp from './createApp'
let { app, router ,store} = createApp();
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}
router.onReady(() => {
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to)
        const prevMatched = router.getMatchedComponents(from)
        let diffed = false
        const activated = matched.filter((c, i) => {
            return diffed || (diffed = (prevMatched[i] !== c))
        })
        const asyncDataHooks = activated.map((c:any) => c.asyncData).filter(_ => _)
        if (!asyncDataHooks.length) {
            return next()
        }


        Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
            .then(() => {
                next()
            })
            .catch(next)
    })

    app.$mount('#app')


})