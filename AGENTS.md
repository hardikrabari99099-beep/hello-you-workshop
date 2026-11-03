<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture (migrated IndiFunded app)
- Pages are the original JSX components in `src/views/` and `src/components/`, mounted by thin TanStack route files in `src/routes/`; keeps the ported UI unchanged.
- Original pages import routing from `@/lib/router-compat` (react-router-style API over TanStack Router); never add react-router-dom.
- All app data calls go through axios `api` (`src/lib/api.js`) to the catch-all server route `src/routes/api/$.ts`, which dispatches to `src/server/api-handler.js` (port of the old FastAPI backend); keeps the old endpoint contract, including `/api/webhooks/razorpay`.
- Data is stored as JSON documents in `public.docs` (collection + id), accessed only server-side with the service role; RLS has no client policies by design.
- Admin access comes only from `public.user_roles` (role `admin`), checked server-side per request.
