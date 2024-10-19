import express from 'express'
import { dbx } from '../dropbox'

const router = express.Router()

async function fetchDropboxFile(path: string) {
    const a = 'https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa?e=3&dl=0'
    const res = await dbx.sharingGetSharedLinkFile({
        path: path,
        url: "https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa?e=3&dl=0"
    })

    // @ts-ignore
    return res.result.fileBinary.toString()
}

async function fetchDropboxFileMetadata(path: string) {
    const a = 'https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa?e=3&dl=0'
    const res = await dbx.sharingGetSharedLinkMetadata({
        path: path,
        url: "https://www.dropbox.com/sh/nx3tnilzqz7df8a/AAAYlTq2tiEHl5hsESw6-yfLa?e=3&dl=0"
    })

    // @ts-ignore
    return res.result.size
}


router.route('/:contest')
    .get(async (req, res) => {
        const { contest } = req.params
        const clipDifficulty = (difficulty: number): number =>
            Math.round(
                difficulty >= 400 ? difficulty : 400 / Math.exp(1.0 - difficulty / 400)
            );

        fetch('https://kenkoooo.com/atcoder/resources/problem-models.json')
            .then((response) => response.json())
            .then((response) => {
                res.setHeader('Cache-Control', 'max-age: 3600')
                const ans = []

                for (let i = 97; i <= 122; i++) {
                    const problemID = contest.toLowerCase() + '_' + String.fromCharCode(i)

                    if (!response[problemID]) {
                        break
                    }

                    ans.push({ difficulty: clipDifficulty(response[problemID].difficulty) })
                }

                res.send(ans)
            }).catch((err) => res.status(500).send())
    })

router.route('/:contest/:problem/testcase/:testcase')
    .get(async (req, res) => {
        const { contest, problem, testcase } = req.params

        try {
            const input = await fetchDropboxFile(`/${contest}/${problem.toUpperCase()}/in/${testcase}`)
            const output = await fetchDropboxFile(`/${contest}/${problem.toUpperCase()}/out/${testcase}`)

            res.send({ in: input, out: output })
        } catch {
            try {
                const input = await fetchDropboxFile(`/${contest.toUpperCase()}/${problem.toUpperCase()}/in/${testcase}`)
                const output = await fetchDropboxFile(`/${contest.toUpperCase()}/${problem.toUpperCase()}/out/${testcase}`)

                res.send({ in: input, out: output })
            } catch {
                res.status(404).send()
            }
        }
    })

router.route('/:contest/:problem/testcase/:testcase/metadata')
    .get(async (req, res) => {
        const { contest, problem, testcase } = req.params

        try {
            const input = await fetchDropboxFileMetadata(`/${contest}/${problem.toUpperCase()}/in/${testcase}`)
            const output = await fetchDropboxFileMetadata(`/${contest}/${problem.toUpperCase()}/out/${testcase}`)

            res.send({ in: input, out: output })
        } catch {
            try {
                const input = await fetchDropboxFileMetadata(`/${contest.toUpperCase()}/${problem.toUpperCase()}/in/${testcase}`)
                const output = await fetchDropboxFileMetadata(`/${contest.toUpperCase()}/${problem.toUpperCase()}/out/${testcase}`)

                res.send({ in: input, out: output })
            } catch {
                res.status(404).send()
            }
        }
    })

export default router