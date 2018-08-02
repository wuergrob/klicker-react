import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import SplitPane from 'react-split-pane'
import { defineMessages, intlShape } from 'react-intl'
import { Checkbox, Dropdown, Menu, Icon } from 'semantic-ui-react'

import { CommonLayout } from '.'
import { Info, Possibilities, Statistics, VisualizationType } from '../evaluation'
import { QUESTION_GROUPS, CHART_TYPES, QUESTION_TYPES } from '../../constants'

const messages = defineMessages({
  showSolutionLabel: {
    defaultMessage: 'Show solution',
    id: 'evaluation.showSolution.label',
  },
})
const propTypes = {
  activeInstance: PropTypes.number,
  activeVisualization: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      correct: PropTypes.bool,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf().isRequired,
  description: PropTypes.string,
  instanceSummary: PropTypes.arrayOf(PropTypes.object),
  intl: intlShape.isRequired,
  onChangeActiveInstance: PropTypes.func.isRequired,
  onChangeVisualizationType: PropTypes.func.isRequired,
  onToggleShowSolution: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  pageTitle: PropTypes.string,
  showGraph: PropTypes.bool,
  showSolution: PropTypes.bool,
  statistics: PropTypes.shape({
    mean: PropTypes.number.isRequired,
    median: PropTypes.number.isRequired,
  }),
  title: PropTypes.string.isRequired,
  totalResponses: PropTypes.number,
  type: PropTypes.string.isRequired,
}

const defaultProps = {
  activeInstance: 0,
  description: undefined,
  instanceSummary: [],
  pageTitle: 'EvaluationLayout',
  showGraph: false,
  showSolution: false,
  statistics: undefined,
  totalResponses: undefined,
}

function EvaluationLayout({
  activeVisualization,
  data,
  intl,
  pageTitle,
  showGraph,
  showSolution,
  onToggleShowSolution,
  children,
  type,
  description,
  onChangeVisualizationType,
  totalResponses,
  options,
  activeInstance,
  onChangeActiveInstance,
  instanceSummary,
  statistics,
}) {
  return (
    <CommonLayout baseFontSize="22px" nextHeight="100%" pageTitle={pageTitle}>
      <div
        className={classNames('evaluationLayout', {
          fullScreen: [CHART_TYPES.CLOUD_CHART, CHART_TYPES.TABLE].includes(activeVisualization),
        })}
      >
        {(() => {
          if (instanceSummary.length <= 0) {
            return null
          }

          if (instanceSummary.length > 8) {
            const dropdownOptions = instanceSummary.map(({ blockStatus, title, totalResponses: count }, index) => ({
              icon: blockStatus === 'ACTIVE' ? 'comments' : 'checkmark',
              key: index,
              text: `${title} (${count})`,
              value: index,
            }))

            return (
              <div className="instanceDropdown">
                <Dropdown
                  search
                  selection
                  defaultValue={activeInstance}
                  options={dropdownOptions}
                  placeholder="Select Question"
                  onChange={(param, { value }) => onChangeActiveInstance(value)}
                />
              </div>
            )
          }

          return (
            <div className="instanceChooser">
              <Menu fitted tabular>
                <Menu.Item
                  className="hoverable"
                  disabled={activeInstance === 0}
                  icon="arrow left"
                  onClick={() => onChangeActiveInstance(activeInstance - 1)}
                />

                {instanceSummary.map(({ blockStatus, title, totalResponses: count }, index) => (
                  <Menu.Item
                    fitted
                    active={index === activeInstance}
                    className={classNames('hoverable', {
                      executed: blockStatus === 'EXECUTED',
                    })}
                    onClick={() => onChangeActiveInstance(index)}
                  >
                    <Icon name={blockStatus === 'ACTIVE' ? 'comments' : 'checkmark'} />
                    {title.length > 15 ? `${title.substring(0, 15)}...` : title} ({count})
                  </Menu.Item>
                ))}

                <Menu.Item
                  className="hoverable"
                  disabled={activeInstance + 1 === instanceSummary.length}
                  icon="arrow right"
                  onClick={() => onChangeActiveInstance(activeInstance + 1)}
                />
              </Menu>
            </div>
          )
        })()}

        <div className="questionDetails">
          <p>{description}</p>
        </div>

        <div className="pane">
          <SplitPane defaultSize="17rem" primary="second" split="vertical">
            <div className="chart">{children}</div>

            {activeVisualization !== CHART_TYPES.TABLE && (
              <>
                {QUESTION_GROUPS.WITH_POSSIBILITIES.includes(type) && (
                  <div className="optionDisplay">
                    <Possibilities
                      data={data}
                      questionOptions={options}
                      questionType={type}
                      showGraph={showGraph}
                      showSolution={showSolution}
                    />
                  </div>
                )}

                {QUESTION_GROUPS.WITH_STATISTICS.includes(type) &&
                  statistics && (
                    <div className="statistics">
                      <Statistics {...statistics} withBins={activeVisualization === 'HISTOGRAM'} />
                    </div>
                  )}
              </>
            )}
          </SplitPane>
        </div>

        <div className="info">
          <Info totalResponses={totalResponses} />
          {/* don't show 'show solution' check box for free and free range questions
          and word cloud charts */
          type !== QUESTION_TYPES.FREE &&
            type !== QUESTION_TYPES.FREE_RANGE &&
            activeVisualization !== CHART_TYPES.CLOUD_CHART && (
              <Checkbox
                toggle
                defaultChecked={showSolution}
                label={intl.formatMessage(messages.showSolutionLabel)}
                onChange={onToggleShowSolution}
              />
            )}

          <VisualizationType
            activeVisualization={activeVisualization}
            intl={intl}
            questionType={type}
            onChangeType={onChangeVisualizationType}
          />
        </div>

        <style global jsx>{`
          .Resizer {
            background: #000;
            opacity: 0.2;
            z-index: 1;
            -moz-box-sizing: border-box;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            -moz-background-clip: padding;
            -webkit-background-clip: padding;
            background-clip: padding-box;
          }

          .Resizer:hover {
            -webkit-transition: all 2s ease;
            transition: all 2s ease;
          }

          .Resizer.horizontal {
            height: 11px;
            margin: -5px 0;
            border-top: 5px solid rgba(255, 255, 255, 0);
            border-bottom: 5px solid rgba(255, 255, 255, 0);
            cursor: row-resize;
            width: 100%;
          }

          .Resizer.horizontal:hover {
            border-top: 5px solid rgba(0, 0, 0, 0.5);
            border-bottom: 5px solid rgba(0, 0, 0, 0.5);
          }

          .Resizer.vertical {
            width: 11px;
            margin: 0 -5px;
            border-left: 5px solid rgba(255, 255, 255, 0);
            border-right: 5px solid rgba(255, 255, 255, 0);
            cursor: col-resize;
          }

          .Resizer.vertical:hover {
            border-left: 5px solid rgba(0, 0, 0, 0.5);
            border-right: 5px solid rgba(0, 0, 0, 0.5);
          }
          .Resizer.disabled {
            cursor: not-allowed;
          }
          .Resizer.disabled:hover {
            border-color: transparent;
          }
        `}</style>
        <style jsx>{`
          @import 'src/theme';

          .evaluationLayout {
            display: flex;
            flex-direction: column;
            height: 100vh;
            max-height: 100vh;
            max-width: 100vw;

            .instanceChooser,
            .questionDetails,
            .info {
              flex: 0 0 auto;
            }

            .pane {
              flex: 1;
            }

            .instanceChooser {
              padding: 0.3rem;
              padding-bottom: 0;
              border-bottom: 1px solid $color-primary;

              :global(.menu) {
                min-height: 0;
                margin-bottom: -1px;
                border-bottom: 1px solid $color-primary;

                :global(.item) {
                  font-size: 0.7rem;
                  padding: 0 0.6rem;
                  margin: 0 0 -1px 0;
                  height: 2rem;
                }

                :global(.item.active) {
                  border-color: $color-primary;
                  background-color: $color-primary-background;
                  border-bottom: 1px solid $color-primary-background;
                }

                :global(.item.hoverable:hover) {
                  background-color: $color-primary-10p;
                }

                :global(.item.executed) {
                  color: grey;
                }
              }
            }

            .instanceDropdown {
              font-size: 0.8rem;
            }

            .questionDetails {
              background-color: $color-primary-background;
              border-bottom: 1px solid $color-primary;
              padding: 1rem;
              text-align: left;

              h1 {
                font-size: 1.5rem;
                line-height: 1.5rem;
                margin-bottom: 0.5rem;
              }

              p {
                font-size: 1.2rem;
                font-weight: bold;
                line-height: 1.5rem;
              }
            }

            .chart {
              height: 100%;
              padding: 1rem 0.5rem 1rem 1rem;

              :global(> *) {
                border: 1px solid lightgrey;
              }
            }

            .chartType {
              padding: 1rem;
            }

            .optionDisplay,
            .statistics {
              padding: 1rem 1rem 1rem 0.5rem;
            }

            .info {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              border-top: 1px solid lightgrey;
              background-color: #f3f3f3;
              padding: 0.5rem 1rem;
            }

            .optionDisplay {
              h2 {
                font-size: 1.5rem;
                line-height: 1.5rem;
                margin-bottom: 0.5rem;
              }
            }
          }
        `}</style>
      </div>
    </CommonLayout>
  )
}

EvaluationLayout.propTypes = propTypes
EvaluationLayout.defaultProps = defaultProps

export default EvaluationLayout
