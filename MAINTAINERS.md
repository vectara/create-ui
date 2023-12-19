# Maintainers

Maintaining a template typically requires running it locally and seeing it live-update as you make changes to the code. You can do this by configuring a root-level `.env` and running `npm run dev:APP_NAME`. The app will be served at http://localhost:4444.

The minimum requirements for `.env` are:

```
REACT_APP_corpus_id=1
REACT_APP_customer_id=1
REACT_APP_app_title=My title
REACT_APP_search_title=My search title
REACT_APP_api_key=KEY
REACT_APP_endpoint=api.vectara.io
```
