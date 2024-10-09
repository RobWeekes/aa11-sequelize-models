const { setupBefore, setupChai, removeTestDB, runSQLQuery } = require('./utils/test-utils');
const chai = setupChai();
const expect = chai.expect;

describe('Colors Spec', async () => {
    let DB_TEST_FILE, models, server;
    before(async () => ({ server, models, DB_TEST_FILE } = await setupBefore(__filename)));
    after(async () => await removeTestDB(DB_TEST_FILE));

    describe('Color models has the correct constraints', async () => {

        it('The name of the color cannot be null', async () => {
            await expect(models.Color.build({}).validate()).to.be.rejected
        });

        it('The color cannot be a non-string value', async () => {
            await expect(models.Color.build({name: []}).validate()).to.be.rejected
        });

        it('The color has a valid name', async () => {
            await expect(models.Color.build({name: 'Purple'}).validate()).to.be.fulfilled
        });

        it('The colors are unique', async () => {
            try {
                await expect(models.Color.create({name: 'Red'})).to.be.fulfilled
                await expect(models.Color.create({name: 'Red'})).to.be.rejected
                throw new Error('Uniqueness constraint not enforced');
            } catch (error) {
                console.error('Detailed error:', error);
                // console.error('Error name:', error.name);
                // console.error('Error message:', error.message);
                if (error.errors) {
                    console.error('Validation errors:', error.errors);
                }
                // Re-throw the error to fail the test
                // throw error;
            }
            const colors = await runSQLQuery("SELECT * FROM 'Colors';", DB_TEST_FILE);
            expect(colors).to.have.lengthOf(1);
        });
    });
});
