// Fix for JEST incompatibility with Sequelize encoding
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const { assert } = require('chai');

const {
  generateMockProject,
  generateMockReward
} = require('../../dev-data/seeds/generator');

const mockProject = generateMockProject();
const mockReward = generateMockReward();

/**
 * Faker Generator Unit Tests
 */
describe('mock generator', function () {
  /**
   * Project Model Unit Tests
   */
  context('mock project', function () {
    it('should correctly mock a project model', function (done) {
      assert.isString(mockProject.title);

      assert.isString(mockProject.title);
      assert.isString(mockProject.creator);
      assert.isString(mockProject.subtitle);
      assert.isString(mockProject.category);
      assert.isString(mockProject.subcategory);
      assert.isString(mockProject.location);
      assert.isString(mockProject.heroImage);
      assert.isString(mockProject.heroVideo);
      assert.isString(mockProject.launchDate);
      assert.isNumber(mockProject.campaignDuration);
      assert.isNumber(mockProject.budget);
      assert.isNumber(mockProject.fundingGoal);
      done();
    });
  });

  /**
   * Rewards Model Unit Test
   */
  context('mock reward', function () {
    it('should correctly mock a rewards model', function (done) {
      assert.isString(mockReward.title);
      assert.isNumber(mockReward.pledgeAmount);
      assert.isString(mockReward.description);
      assert.isString(mockReward.deliveryMonth);
      assert.isNumber(mockReward.deliveryYear);
      assert.isString(mockReward.shippingType);
      assert.isNumber(mockReward.rewardQuantity);
      assert.isNumber(mockReward.timeLimit);
      assert.isNumber(mockReward.projectId);
      assert.isString(mockReward.rewardItems);
      done();
    });

    it('should only contain strings in the rewards items array', function (done) {
      assert.isTrue(
        mockReward.rewardItems
          .split(',')
          .every((item) => typeof item === 'string')
      );
      done();
    });
  });
});
