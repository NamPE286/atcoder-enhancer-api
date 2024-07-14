import express from 'express'

const router = express.Router()

async function fetchProblemTags(problemID: string) {
    const res = await fetch(`https://atcoder-tags.herokuapp.com/check/${problemID}`)
    const htmlText = await res.text()
    let arrayText: string = ''

    for (let i = htmlText.indexOf("var labels = ") + 13; i < htmlText.indexOf("var labels = ") + 1000; i++) {
        arrayText += htmlText[i]

        if (htmlText[i] == ']') {
            break
        }
    }

    return JSON.parse(arrayText)
}

router.route('/:id/tags')
    .get(async (req, res) => {
        const { id } = req.params

        try {
            res.send(await fetchProblemTags(id))
        } catch {
            res.status(404).send()
        }
    })

export default router