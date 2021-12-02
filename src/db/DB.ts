import * as Sqlite3 from 'sqlite3'
import { Column, Db, Primary, SQLite3Driver } from 'sqlite-ts'
const dbFile = 'scores.db'

class Highscore {
    @Primary('NVARCHAR')
    id: string = ""

    @Column('NVARCHAR')
    name: string  = ""

    @Column('INTEGER')
    score: number = 0
}

const entities = {Highscore}
let sqlite3Db = new Sqlite3.Database(dbFile, Sqlite3.OPEN_READWRITE, (err:any ) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        console.log('error opeing db file.')
        createDatabase()
        } else if (err) {
            console.log("Getting error " + err)
            process.exit(1)
    }
});

function createDatabase() {
    sqlite3Db = new Sqlite3.Database(dbFile, (err) => {
        if (err) {
            console.log("Getting error " + err)
            process.exit(1)
        }
    });
}

let db: Db<{
    Highscore: typeof Highscore;
}> | undefined = undefined;


const initDB = async () => Db.init({
    // set the driver
    driver: new SQLite3Driver(sqlite3Db),

    // set your entities here
    entities,

    // set `true` so all tables in entities will automatically created for you
    // if it does not exists yet in database
    createTables: true
})

export const getUserScore = async (id: string): Promise<number> => {
    if ( ! db ){
        db = await initDB()
    }
    const highscore = await db.tables.Highscore.single(c => c.score).where(c =>
        c.equals({ id })
      )
    if ( highscore ) return highscore.score
    else return 0
}

export const setUserScore = async (id: string, name: string,  increase: number): Promise<number> => {
    if ( ! db ){
        db = await initDB()
    }
    const oldScore = await getUserScore(id)
    const newScore = oldScore + increase
    await db.tables.Highscore.upsert( {id,name,score: newScore})
    return newScore
}

export const getHighscores = async() : Promise<Highscore[]> => {
    if ( ! db ){
        db = await initDB()
    }
    return db.tables.Highscore.select(c => [c.name,c.score]).orderBy({score:"ASC"})
}

export const resetHighscores = async() =>{
    if ( ! db ){
        db = await initDB()
    }
    await db.tables.Highscore.delete()
}